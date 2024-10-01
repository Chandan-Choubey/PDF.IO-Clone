import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { setupServer } from "msw/node";
import { http } from "msw";
import RotateVideo from "./component/RotateVideo";

const server = setupServer(
  http.post("http://localhost:8080/rotate-video", (req, res, ctx) => {
    const { angle } = req.body;
    if (angle) {
      const mockBlob = new Blob(["video content"], { type: "video/mp4" });
      return res(ctx.status(200), ctx.body(mockBlob));
    }
    return res(ctx.status(400), ctx.json({ error: "Invalid request" }));
  })
);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

describe("RotateVideo Component", () => {
  const mockOnClose = jest.fn();

  it("renders the RotateVideo component correctly", () => {
    render(<RotateVideo onClose={mockOnClose} />);

    expect(screen.getByText(/Rotate Video/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Drag & Drop your video file here, or click to select/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Rotation Angle/i)).toBeInTheDocument();
    expect(screen.getByText(/Rotate Video/i)).toBeInTheDocument();
  });

  it("rotates video successfully and provides a download link", async () => {
    render(<RotateVideo onClose={mockOnClose} />);

    const videoFile = new File(["video content"], "video.mp4", {
      type: "video/mp4",
    });

    const input = screen.getByLabelText(/Rotation Angle/i);
    fireEvent.drop(input, {
      target: { files: [videoFile] },
    });

    fireEvent.change(screen.getByLabelText(/Rotation Angle/i), {
      target: { value: "90" },
    });

    fireEvent.click(screen.getByText(/Rotate Video/i));

    await waitFor(() => {
      expect(
        screen.getByText(/Video rotated successfully./i)
      ).toBeInTheDocument();
    });
    expect(screen.getByText(/Download Rotated Video/i)).toHaveAttribute(
      "href",
      expect.any(String)
    );
  });

  it("shows an error message if video rotation fails", async () => {
    server.use(
      http.post("http://localhost:8080/rotate-video", (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ error: "Internal Server Error" })
        );
      })
    );

    render(<RotateVideo onClose={mockOnClose} />);

    const videoFile = new File(["video content"], "video.mp4", {
      type: "video/mp4",
    });
    const input = screen.getByLabelText(/Rotation Angle/i);

    fireEvent.drop(input, {
      target: { files: [videoFile] },
    });

    fireEvent.change(screen.getByLabelText(/Rotation Angle/i), {
      target: { value: "90" },
    });

    fireEvent.click(screen.getByText(/Rotate Video/i));

    await waitFor(() => {
      expect(
        screen.getByText(/An error occurred while rotating the video./i)
      ).toBeInTheDocument();
    });
  });

  it("calls the onClose function when Close button is clicked", () => {
    render(<RotateVideo onClose={mockOnClose} />);

    fireEvent.click(screen.getByText(/Close/i));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
