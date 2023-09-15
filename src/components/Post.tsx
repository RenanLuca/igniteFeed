import { format, formatDistanceToNow } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR'
import {ChangeEvent, FormEvent, useState} from 'react'

import { Avatar } from './Avatar'
import { Comment } from './Comment'
import styles from './Post.module.css'

interface Author {
    name: string;
    role: string;
    avatarUrl: string;
}

interface Content {
    type: 'paragraph'  |  'link';
    content: string;

}

export interface PostType {
    id: number,
    author: Author;
    publishedAt: Date;
    content: Content [];
}

interface postProps {
    post: PostType;
}


export function Post ({ post }: postProps) {
    const [comments, setComments] = useState([ 
        'Post muito bacana, hein?!' 
    ])

    const [newCommentText, setNewCommentText] = useState('')

    const publishedDateFormatted = format(post.publishedAt, "d 'de' LLLL 'às' HHH:mm 'h'", {
        locale: ptBR,
    })

    const publishedDateRelativeToNow = formatDistanceToNow(post.publishedAt, {
        locale: ptBR,
        addSuffix: true,
    })

    function handleCreateNewComment(event: FormEvent) {
        event.preventDefault()
        setComments([...comments, newCommentText])
        setNewCommentText('')
    }

    function handleNewCommentChange(event: ChangeEvent<HTMLTextAreaElement>) {
        setNewCommentText(event.target.value)
    }

    function deleteComment(commentToDelete: string) {
        const commentsWithoutDeletedOne = comments.filter(comment => {
            return comment != commentToDelete;
        })
        console.log('oi')
        setComments(commentsWithoutDeletedOne);
    }
    const isNewCommentEmpty = newCommentText.length === 0
    return (
        <article className={styles.post}>
            <header>
                <div className={styles.author}>
                    <Avatar src={post.author.avatarUrl} />
                    <div className={styles.authorInfo}>
                        <strong>{post.author.name}</strong>
                        <span>{post.author.role}</span>
                    </div>
                </div>
                <time
                    title={publishedDateFormatted}
                    dateTime={post.publishedAt.toISOString()}>
                        {publishedDateRelativeToNow}
                </time>
            </header>
            <div className={styles.content}>
                {post.content.map(line => {
                    if ( line.type == "paragraph"){
                        return <p key={line.content}>{line.content}</p>
                    } else if ( line.type == "link"){
                        return <p key={line.content}><a href="">{line.content}</a></p>
                    }
                })}
            </div>
            <form onSubmit={handleCreateNewComment} className={styles.commentForm}>
                <strong>Deixe seu feedback</strong>

                <textarea
                    placeholder='Deixe um comentário'
                    onChange={handleNewCommentChange}
                    value={newCommentText}
                    required
                />
                <footer>
                    <button disabled={isNewCommentEmpty} type='submit'>Publicar</button>
                </footer>
          
            </form>
            <div className={styles.commentList}>
                {comments.map(comment => {
                    return(
                        <Comment
                            onDeleteComment={deleteComment}
                            key={comment}
                            content={comment}
                        />
                    )
                })}
            </div>
        </article>
    )
}