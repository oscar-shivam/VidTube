import React, { useEffect, useState } from 'react'
import "./PlayVideo.css"
import video1 from "../../assets/video.mp4"
import like from "../../assets/like.png"
import dislike from "../../assets/dislike.png"
import share from "../../assets/share.png"
import save from "../../assets/save.png"
import jack from "../../assets/jack.png"
import user_profile from "../../assets/user_profile.jpg"
import { API_KEY, value_converter } from '../../Data'
import moment from 'moment'
import { useParams } from 'react-router-dom'

const PlayVideo = () => {

  const {videoId} = useParams();

  const [apiData, setApiData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [commentData, setCommentData] = useState([]);

  const fetchVideoData = async () => {
    //Fetching video data
    const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
    await fetch(videoDetails_url).then(res => res.json()).then(data => setApiData(data.items[0]));
  }

  const fetchOtherData = async () => {
    //Fetching channel data
    const channelData_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
    await fetch(channelData_url).then(res => res.json()).then(data => setChannelData(data.items[0]));

    // Fetching Comment Data
    const comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${API_KEY}`
    await fetch(comment_url).then(res => res.json()).then(data => setCommentData(data.items));
  }

  useEffect(() => {
    fetchVideoData();
  }, [videoId])

  useEffect(() => {
    if (apiData) {
    fetchOtherData();
  }
  }, [apiData])

  return (
    <div className='paly-video'>
      {/* <video src={video1} controls autoPlay muted></video> */}
      <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
      {/* <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}frameBorder="0"allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"referrerPolicy="strict-origin-when-cross-origin"allowFullScreen></iframe> */}

      <h3>{apiData ? apiData.snippet.title : "Title Here"}</h3>
      <div className="play-video-info">
        <p>{apiData ? value_converter(apiData.statistics.viewCount) : "16K"} Views &bull; {apiData ? moment(apiData.snippet.publishedAt).fromNow() : ""}</p>
        {/* <p>{apiData?.statistics?.viewCount? `${value_converter(apiData.statistics.viewCount)} Views • ${moment(apiData.snippet.publishedAt).fromNow()}`: "Loading..."}</p> */}
        <div>
          <span><img src={like} alt="" />{apiData ? value_converter(apiData.statistics.likeCount) : 125}</span>
          <span><img src={dislike} alt="" /></span>
          <span><img src={share} alt="" />Share</span>
          <span><img src={save} alt="" />Save</span>
        </div>
      </div>
      <hr />
      <div className="publisher">
        <img src={channelData ? channelData.snippet.thumbnails.default.url : null} alt="" />
        <div>
          <p>{apiData ? apiData.snippet.channelTitle : ""}</p>
          <span>{channelData ? value_converter(channelData.statistics.subscriberCount) : "1M"} Subscriber</span>
        </div>
        <button>Subscribe</button>
      </div>
      <div className="vid-description">
        <p>{apiData ? apiData.snippet.description.slice(0, 300) : "Description here"}</p>
        <hr />
        <h4>{apiData ? value_converter(apiData.statistics.commentCount) : 102} Comments</h4>

        {commentData.map((item, idx) => {
          return (
            <div className="comment" key={idx}>
              <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="" />
              <div>
                <h3>{item.snippet.topLevelComment.snippet.authorDisplayName}<span>1 day ago</span></h3>
                <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                <div className="comment-action">
                  <img src={like} alt="" />
                  <span>{value_converter(item.snippet.topLevelComment.snippet.likeCount)}</span>
                  <img src={dislike} alt="" />
                </div>
              </div>
            </div>
          )
        })}

        {/* <div className="comment">
          <img src={user_profile} alt="" />
          <div>
            <h3>Jack Nicholson <span>1 day ago</span></h3>
            <p>A global computer network providing a varity of information and
              communication facilities, consisting of interconnected network using standardized communication protocols.</p>
            <div className="comment-action">
              <img src={like} alt="" />
              <span>244</span>
              <img src={dislike} alt="" />
            </div>
          </div>
        </div>
        <div className="comment">
          <img src={user_profile} alt="" />
          <div>
            <h3>Jack Nicholson <span>1 day ago</span></h3>
            <p>A global computer network providing a varity of information and
              communication facilities, consisting of interconnected network using standardized communication protocols.</p>
            <div className="comment-action">
              <img src={like} alt="" />
              <span>244</span>
              <img src={dislike} alt="" />
            </div>
          </div>
        </div>
        <div className="comment">
          <img src={user_profile} alt="" />
          <div>
            <h3>Jack Nicholson <span>1 day ago</span></h3>
            <p>A global computer network providing a varity of information and
              communication facilities, consisting of interconnected network using standardized communication protocols.</p>
            <div className="comment-action">
              <img src={like} alt="" />
              <span>244</span>
              <img src={dislike} alt="" />
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default PlayVideo