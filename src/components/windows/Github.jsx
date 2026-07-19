import React from 'react'
import Macwindow from './Macwindow'
import githubData from '../../assets/github.json'
import './github.scss'


const GitCard = ({data={id:1,image:"",title:"",description:"",tags:[],repoLink:"",demoLink:""}}) => {
     return <div className="card">
        <img src={data.image} alt={data.title} />
        <h1>{data.title}</h1>
        <p>{data.description}</p>

        <div className="tags">
            {data.tags.map(tag => {
                return <p className="tag">{tag}</p>
            })}
        </div>

        <div className="urls">
            <a href={data.repoLink} target="_blank" rel="noopener noreferrer">Repository</a>
            <a href={data.demoLink} target="_blank" rel="noopener noreferrer">Demo</a>
        </div>

     </div>
}


const Github = () => {
  return (
    <div>
        <Macwindow>
            <div className="cards">
                {githubData.map(project => {
                    return <GitCard data={project} />
                })}
            </div>

        </Macwindow>
    </div>
  )
}

export default Github