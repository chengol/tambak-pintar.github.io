import {useState} from 'react'

const useComment = () =>{
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

    const onSubmit = e => {
        e.preventDefault();
        setComments([...comments, comment ])
        setComment('');
    }

    const onChange = e => {
        setComment(e.target.value)
    }

    return{
        comment,
        comments,
        onChange,
        onSubmit
    }
}

export default useComment;