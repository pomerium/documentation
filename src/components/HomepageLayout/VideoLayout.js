import React from 'react';
import styles from './video.module.css';

const data = [
  {
    title: "Pomerium Demo",
    text: "Learn how Pomerium secures your apps and services in this 2-minute demo.",
    video: <iframe frameBorder="0" title="YouTube video player" width="100%" height="350" src="https://www.youtube.com/embed/WGwC9ULDnAY?rel=0"></iframe>
  },
  {
    title: "Clientless Access",
    text: "Learn how Pomerium simplifies access control by providing clientless access to users within your organization.",
    video: <iframe frameBorder="0" title="YouTube video player" width="100%" height="350" src="https://www.youtube.com/embed/bUZUg0e3A1Y"></iframe>
  },
  {
    title: "Continuous Verification",
    text: "Learn what Continuous Verification is, how it works with Pomerium, and why it's important for building a Zero Trust Architecture.",
    video: <iframe frameBorder="0" title="YouTube video player" width="100%" height="350" src="https://www.youtube.com/embed/3MJrNvQ7aIE"></iframe>
  }
]

function VideoCards({title, text, video}) {
  return (
    <div className='video_section'>
      <div className='video_title'>
        <h2>{title}</h2>
      </div>
      <div className={styles.section_body}>
        <div className={styles.video_text}>
          <p>{text}</p>
        </div>
        <div className={styles.video_iframe}>
          {video}
        </div>
      </div>
    </div>
  )
}

export default function() {
  return (
    <div className='videos_section'>
      {data.map((feature, idx) => (
          <VideoCards key={idx} {...feature} />
      ))}
    </div>
  )
}
