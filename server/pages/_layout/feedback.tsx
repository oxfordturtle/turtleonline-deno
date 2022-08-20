import React from "react"

export type FeedbackProps = {
  ok: boolean
  message: string
}

export default (props: FeedbackProps): JSX.Element => (
  <div className={`notice ${props.ok ? "success" : "error"}`}>
    <p>{props.message}</p>
  </div>
)
