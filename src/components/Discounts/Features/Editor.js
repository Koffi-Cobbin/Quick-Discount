import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styled from "styled-components";
import parse from 'html-react-parser';


const modules = {
    toolbar: [
        [{header: [3, 4, 5, 6, false]}],
        [{font: []}],
        [{size: ['small', 'normal']}],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
            {list: "ordered"},
            {list: "bullet"},
            {indent: "-1"},
            {indent: "+1"}
        ],
        [{ 'align': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        // [{ 'direction': 'rtl' }], 
        [{ 'color': [] }, { 'background': [] }],
        ["link"], //"image", "video", "code-block"
        // ["clean"]
    ],
};
// modules can be added as prop to ReactQuill

const Editor = (props) => {
    const [content, setContent] = useState();

    const contentChangeHandler = (value) => {
        setContent(value);
        props.handleTextEditorChange(value);
    };

    useEffect(() => {
        setContent(props.description);
    }, [props.description]);

    return (
        <Container>
            <label>Event description</label>
            <TextEditor>
                <ReactQuill 
                    className='editor-textarea' 
                    theme="snow" 
                    value={content} 
                    modules={modules}
                    placeholder="Enter event description"
                    onChange={(value) => contentChangeHandler(value)} />
            </TextEditor>
            {/* <Preview dangerouslySetInnerHTML={{__html: content}} /> */}
        </Container>
    );
};

const Container = styled.div`
    position: relative;
    text-align: left;
    &>label {
        color: rgba(0, 0, 0, 0.6);
        font-size: 15px;
    }
`;

const TextEditor = styled.div`
    width: 100%;
    height: fit-content;
    margin-bottom: 10px;

    & .editor-textarea {
        height: 400px;
        overflow-y: scroll;
    }
`;

// const Preview = styled.div`
//     height: 150px;
//     width: 99%;
//     margin-top: 0;
//     border: 1px solid black;
// `;

export default Editor;