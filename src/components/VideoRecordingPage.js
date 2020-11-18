import React, { Component } from "react";
import "./../App.css";
const videoType = "video/webm";

export default class VideoRecordingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recording: false,
      videos: [],
    };
  }

  componentDidMount() {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: false,
      })
      .then((stream) => {
        // show it to user
        this.video.srcObject = stream;
        // this.video.onclick((e) => this.video.play());
        this.video.play();

        // init recording
        this.mediaRecorder = new MediaRecorder(stream, {
          mimeType: videoType,
        });

        // init data storage for video chunks
        this.chunks = [];

        // listen for data from media recorder
        this.mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            this.chunks.push(e.data);
          }
        };
      })
      .catch((e) => console.log(e));
  }

  startRecording(e) {
    e.preventDefault();
    // wipe old data chunks
    this.chunks = [];
    // start recorder with 10ms buffer
    this.mediaRecorder.start(10);
    // say that we're recording
    this.setState({ recording: true });
  }

  stopRecording(e) {
    e.preventDefault();
    // stop the recorder
    this.mediaRecorder.stop();
    // say that we're not recording
    this.setState({ recording: false });
    // save the video to memory
    this.saveVideo();
  }

  saveVideo() {
    // convert saved chunks to blob
    const blob = new Blob(this.chunks, { type: "video/mp4" });
    // generate video url from blob
    const videoURL = window.URL.createObjectURL(blob);
    // append videoURL to list of   saved videos for rendering

    const videos = this.state.videos.concat([videoURL]);
    this.setState({ videos });
  }

  deleteVideo(videoURL) {
    // filter out current videoURL from the list of saved videos
    const videos = this.state.videos.filter((v) => v !== videoURL);
    this.setState({ videos });
  }

  render() {
    const { recording, videos } = this.state;

    return (
      <div className="camera">
        <video
          style={{ width: 400 }}
          ref={(v) => {
            this.video = v;
          }}
        >
          Video stream not available.
        </video>
        <div>
          {!recording && (
            <button
              className="MyButton"
              onClick={(e) => this.startRecording(e)}
            >
              Record
            </button>
          )}
          {recording && (
            <button className="MyButton" onClick={(e) => this.stopRecording(e)}>
              Stop
            </button>
          )}
        </div>
        <div>
          <h3>Recorded videos:</h3>
          {videos.map((videoURL, i) => (
            <div key={`video_${i}`}>
              <video style={{ width: 200 }} src={videoURL} controls />
              <div>
                <button onClick={() => this.deleteVideo(videoURL)}>
                  Delete
                </button>
                <a style={{ marginLeft: 30 }} href={videoURL} download>
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
