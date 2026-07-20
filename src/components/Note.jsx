import React, { useEffect } from 'react'
import Markdown from 'react-markdown'
import Macwindow from './windows/Macwindow'
import SyntaxHighlighter from 'react-syntax-highlighter'
import {atelierDuneDark} from 'react-syntax-highlighter/dist/esm/styles/hljs'
import './note.scss'


export const Note = () => {
  
  const [markdown, setMarkdown] = React.useState(null)

  useEffect(() => {
    fetch("/note.txt")
    .then(res=> res.text())
    .then(text => setMarkdown(text))

  },[])



  return (
    <Macwindow>
      <div className="note-window">

      {markdown ? <SyntaxHighlighter style={atelierDuneDark} language='typescript' >{markdown}</SyntaxHighlighter> : <p>Loading...</p>}
      </div>
    </Macwindow>
  )
}
