import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { setupServer } from "msw/node";
import { http } from "msw";
import AddImageToVideo from "./component/AddImageToVideo";

const server = setupServer(
  http.post("http://localhost:8080/add-image-to-video", (req, res, ctx) => {
    const { video, image } = req.body;
    if (video && image) {
      return res(
        ctx.status(200),
        ctx.json({ message: "Image added to video successfully." })
      );
    }
    return res(
      ctx.status(400),
      ctx.json({ error: "Please select both a video and image file." })
    );
  })
);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

describe("AddImageToVideo Component", () => {
  const mockOnClose = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders correctly", () => {
    render(<AddImageToVideo onClose={mockOnClose} />);

    expect(screen.getByText("Add Image to Video")).toBeInTheDocument();
    expect(
      screen.getByText("Drag & drop a video file here, or click to select one")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Drag & drop an image file here, or click to select one")
    ).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  test("shows error message when files are not selected", async () => {
    render(<AddImageToVideo onClose={mockOnClose} />);
    fireEvent.click(screen.getByText("Submit"));

    expect(
      await screen.findByText("Please select both a video and image file.")
    ).toBeInTheDocument();
  });

  test("uploads video and image files and shows success message", async () => {
    render(<AddImageToVideo onClose={mockOnClose} />);

    const videoFile = new File(["(video)"], "test_video.mp4", {
      type: "video/mp4",
    });
    const videoDropzone = screen.getByText(
      "Drag & drop a video file here, or click to select one"
    );
    fireEvent.drop(videoDropzone, { target: { files: [videoFile] } });
    expect(
      screen.getByText(`Selected video: ${videoFile.name}`)
    ).toBeInTheDocument();

    const imageFile = new File(["(image)"], "test_image.png", {
      type: "image/png",
    });
    const imageDropzone = screen.getByText(
      "Drag & drop an image file here, or click to select one"
    );
    fireEvent.drop(imageDropzone, { target: { files: [imageFile] } });
    expect(
      screen.getByText(`Selected image: ${imageFile.name}`)
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() =>
      expect(
        screen.findByText("Image added to video successfully.")
      ).toBeInTheDocument()
    );
  });

  test("shows error message on server failure", async () => {
    server.use(
      http.post("http://localhost:8080/add-image-to-video", (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            error: "An error occurred while processing your request.",
          })
        );
      })
    );

    render(<AddImageToVideo onClose={mockOnClose} />);

    const videoFile = new File(["(video)"], "test_video.mp4", {
      type: "video/mp4",
    });
    const videoDropzone = screen.getByText(
      "Drag & drop a video file here, or click to select one"
    );
    fireEvent.drop(videoDropzone, { target: { files: [videoFile] } });
    expect(
      screen.getByText(`Selected video: ${videoFile.name}`)
    ).toBeInTheDocument();

    const imageFile = new File(["(image)"], "test_image.png", {
      type: "image/png",
    });
    const imageDropzone = screen.getByText(
      "Drag & drop an image file here, or click to select one"
    );
    fireEvent.drop(imageDropzone, { target: { files: [imageFile] } });
    expect(
      screen.getByText(`Selected image: ${imageFile.name}`)
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() =>
      expect(
        screen.getByText("An error occurred while processing your request.")
      ).toBeInTheDocument()
    );
  });

  test("calls onClose when Close button is clicked", () => {
    render(<AddImageToVideo onClose={mockOnClose} />);

    fireEvent.click(screen.getByText("Close"));

    expect(mockOnClose).toHaveBeenCalled();
  });
});
