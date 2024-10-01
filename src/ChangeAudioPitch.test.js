import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { setupServer } from "msw/node";
import { http } from "msw";
import ChangeAudioPitch from "./component/ChangeAudioPitch";
import { useDropzone } from "react-dropzone";

jest.mock("react-dropzone", () => ({
  useDropzone: jest.fn(),
}));

const server = setupServer(
  http.post("http://localhost:8080/change-pitch", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.body(new Blob(["mock audio data"], { type: "audio/mp3" }))
    );
  })
);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

describe("ChangeAudioPitch Component", () => {
  beforeEach(() => {
    useDropzone.mockImplementation(({ onDrop }) => ({
      getRootProps: jest.fn(() => ({})),
      getInputProps: jest.fn(() => ({})),
      isDragActive: false,
      isDragReject: false,
      onDrop,
    }));
  });

  it("renders the pitch slider and applies pitch change", async () => {
    render(<ChangeAudioPitch onClose={() => {}} />);

    const mockAudioFile = new File(["(⌐□_□)"], "test_audio.mp3", {
      type: "audio/mp3",
    });

    const dropzone = screen.getByText(
      "Drag 'n' drop an audio file here, or click to select a file"
    );
    fireEvent.drop(dropzone, {
      dataTransfer: { files: [mockAudioFile] },
    });

    expect(screen.getByText("test_audio.mp3")).toBeInTheDocument();

    const pitchSlider = screen.getByRole("slider");
    fireEvent.change(pitchSlider, { target: { value: 1.5 } });
    expect(pitchSlider.value).toBe("1.5");

    const applyButton = screen.getByText("Apply Pitch Change");
    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(screen.getByText("Download Adjusted Audio")).toBeInTheDocument();
    });
  });

  it("shows an error message when an invalid file type is selected", () => {
    render(<ChangeAudioPitch onClose={() => {}} />);

    const invalidFile = new File(["(⌐□_□)"], "test_video.mp4", {
      type: "video/mp4",
    });

    const dropzone = screen.getByText(
      "Drag 'n' drop an audio file here, or click to select a file"
    );
    fireEvent.drop(dropzone, {
      dataTransfer: { files: [invalidFile] },
    });

    expect(
      screen.getByText("Invalid file type. Please select an audio file.")
    ).toBeInTheDocument();
  });

  it("displays an error when the API request fails", async () => {
    server.use(
      http.post("http://localhost:8080/change-pitch", (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: "API request failed" }));
      })
    );

    render(<ChangeAudioPitch onClose={() => {}} />);

    const mockAudioFile = new File(["(⌐□_□)"], "test_audio.mp3", {
      type: "audio/mp3",
    });

    const dropzone = screen.getByText(
      "Drag 'n' drop an audio file here, or click to select a file"
    );
    fireEvent.drop(dropzone, {
      dataTransfer: { files: [mockAudioFile] },
    });

    const applyButton = screen.getByText("Apply Pitch Change");
    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(screen.getByText("Failed to process audio.")).toBeInTheDocument();
    });
  });

  it("calls onClose when the Close button is clicked", () => {
    const onClose = jest.fn();
    render(<ChangeAudioPitch onClose={onClose} />);

    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalled();
  });
});
