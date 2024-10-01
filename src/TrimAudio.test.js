import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { setupServer } from "msw/node";
import { http } from "msw";
import TrimAudio from "./component/TrimAudio"; 

const server = setupServer(
  http.post("http://localhost:8080/trim-audio", (req, res, ctx) => {
    const { startTime, endTime } = req.body;

    if (startTime < endTime) {
      const mockBlob = new Blob(["trimmed audio content"], {
        type: "audio/mp3",
      });
      return res(ctx.status(200), ctx.body(mockBlob));
    }
    return res(ctx.status(400), ctx.json({ error: "Invalid time range" }));
  })
);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

describe("TrimAudio Component", () => {
  it("renders the component correctly", () => {
    render(<TrimAudio onClose={jest.fn()} />);

    expect(screen.getByText(/Trim Audio/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Drag & Drop your audio file here/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Start Time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/End Time/i)).toBeInTheDocument();
    expect(screen.getByText(/Trim/i)).toBeInTheDocument();
  });

  it("should display an alert if no audio file is selected when trim button is clicked", () => {
    const alertMock = jest.spyOn(window, "alert").mockImplementation();
    render(<TrimAudio onClose={jest.fn()} />);

    fireEvent.click(screen.getByText(/Trim/i));
    expect(alertMock).toHaveBeenCalledWith(
      "Please select an audio file first."
    );
  });

  it("should display an alert if end time is less than or equal to start time", () => {
    const alertMock = jest.spyOn(window, "alert").mockImplementation();
    render(<TrimAudio onClose={jest.fn()} />);

    fireEvent.change(screen.getByLabelText(/Start Time/i), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByLabelText(/End Time/i), {
      target: { value: "5" },
    });
    fireEvent.click(screen.getByText(/Trim/i));

    expect(alertMock).toHaveBeenCalledWith(
      "End time must be greater than start time."
    );
  });

  it("uploads audio file and trims successfully", async () => {
    const file = new File(["audio content"], "test_audio.mp3", {
      type: "audio/mp3",
    });

    render(<TrimAudio onClose={jest.fn()} />);

    const input = screen.getByLabelText("Start Time");
    fireEvent.drop(input, { target: { files: [file] } });

    fireEvent.change(screen.getByLabelText(/Start Time/i), {
      target: { value: "5" },
    });
    fireEvent.change(screen.getByLabelText(/End Time/i), {
      target: { value: "10" },
    });
    fireEvent.click(screen.getByText(/Trim/i));

    await waitFor(() => {
      expect(screen.getByText(/Trimmed Audio:/i)).toBeInTheDocument();
    });
    expect(screen.getByRole("audio")).toHaveAttribute("controls");
  });
});
