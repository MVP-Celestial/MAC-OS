import React, { useRef } from 'react'
import Macwindow from './Macwindow'
import githubData from '../../assets/github.json'
import './github.scss'


const GitCard = ({ data = { id: 1, image: "", title: "", description: "", tags: [], repoLink: "", demoLink: "" } }) => {
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
        const card = cardRef.current;
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `
            perspective(1200px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateY(-8px)
            scale(1.02)
        `;
    };

    const handleMouseEnter = () => {
        cardRef.current?.classList.add("is-hovering");
    };

    const handleMouseLeave = () => {
        const card = cardRef.current;
        if (!card) return;
        card.style.transform = `
            perspective(1200px)
            rotateX(0deg)
            rotateY(0deg)
            translateY(0px)
            scale(1)
        `;
        card.classList.remove("is-hovering");
    };

    return (
        <div
            className="card"
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="image-wrap">
                <img src={data.image} alt={data.title} />
            </div>

            <h1>{data.title}</h1>
            <p className="description">{data.description}</p>

            <div className="tags">
                {data.tags.map((tag, index) => {
                    return <p className="tag" key={index}>{tag}</p>
                })}
            </div>

            <div className="urls">
                <a href={data.repoLink} target="_blank" rel="noopener noreferrer">Repository</a>
                <a href={data.demoLink} target="_blank" rel="noopener noreferrer">Demo</a>
            </div>
        </div>
    )
}


const Github = () => {
    return (
        <div>
            <Macwindow>
                <div className="cards">
                    {githubData.map(project => {
                        return <GitCard data={project} key={project.id} />
                    })}
                </div>
            </Macwindow>
        </div>
    )
}

export default Github