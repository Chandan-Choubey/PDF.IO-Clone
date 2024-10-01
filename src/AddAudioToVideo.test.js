import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { setupServer } from "msw/node";
import { http } from "msw";
import AddAudioToVideo from "./component/AddAudioToVideo";

const server = setupServer(
  http.post("http://localhost:8080/add-audio-to-video", (req, res, ctx) => {
    const { video, audio } = req.body;
    if (video && audio) {
      const mockBlob = new Blob(["video with audio content"], {
        type: "video/mp4",
      });
      return res(ctx.status(200), ctx.body(mockBlob));
    }
    return res(ctx.status(400), ctx.json({ error: "Invalid request" }));
  })
);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());


afterAll(() => server.close());

jest.mock("axios");

describe("AddAudioToVideo Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the component with default elements", () => {
    render(<AddAudioToVideo onClose={() => {}} />);

    expect(
      screen.getByText(/Drag and drop your video file/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Drag and drop your audio file/i)
    ).toBeInTheDocument();
    const heading = screen.getByRole("heading", {
      level: 2,
      name: /Add Audio to Video/i,
    });
    expect(heading).toBeInTheDocument();
  });

  test("shows validation message when no files are selected", async () => {
    render(<AddAudioToVideo onClose={() => {}} />);
    const addButton = screen.getByRole("button", {
      name: /Add Audio to Video/i,
    });
    fireEvent.click(addButton);

    expect(
      await screen.findByText(/Please select both a video and audio file/i)
    ).toBeInTheDocument();
  });

  test("adds audio to video successfully", async () => {
    render(<AddAudioToVideo onClose={() => {}} />);

    const videoFile = new File(["video content"], "video.mp4", {
      type: "video/mp4",
    });
    const audioFile = new File(["audio content"], "audio.mp3", {
      type: "audio/mpeg",
    });

    const videoInput = screen.getByText(/Drag and drop your video file/i);
    fireEvent.drop(videoInput, {
      target: { files: [videoFile] },
    });

    const audioInput = screen.getByText(/Drag and drop your audio file/i);
    fireEvent.drop(audioInput, {
      target: { files: [audioFile] },
    });

    const addButton = screen.getByRole("button", {
      name: /Add Audio to Video/i,
    });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Audio added to video successfully/i)
      ).toBeInTheDocument();
    });
    expect(screen.getByText(/Download Video/i)).toHaveAttribute(
      "href",
      expect.any(String)
    );
  });

  test("shows an error message if API call fails", async () => {
    server.use(
      http.post("http://localhost:8080/add-audio-to-video", (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ error: "Internal Server Error" })
        );
      })
    );

    render(<AddAudioToVideo onClose={() => {}} />);

    const videoFile = new File(["video content"], "video.mp4", {
      type: "video/mp4",
    });
    const audioFile = new File(["audio content"], "audio.mp3", {
      type: "audio/mpeg",
    });

    const videoInput = screen.getByText(/Drag and drop your video file/i);
    fireEvent.drop(videoInput, {
      target: { files: [videoFile] },
    });

    const audioInput = screen.getByText(/Drag and drop your audio file/i);
    fireEvent.drop(audioInput, {
      target: { files: [audioFile] },
    });

    const addButton = screen.getByRole("button", {
      name: /Add Audio to Video/i,
    });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(
        screen.getByText(/An error occurred while adding audio to video./i)
      ).toBeInTheDocument();
    });
  });

  test("calls the onClose function when Close button is clicked", () => {
    const mockOnClose = jest.fn();
    render(<AddAudioToVideo onClose={mockOnClose} />);

    fireEvent.click(screen.getByText(/Close/i));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
