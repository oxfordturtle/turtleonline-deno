import React from "https://esm.sh/react@18.2.0"

export type FeedbackProps = {
  ok: boolean
  message: string
}

export default (props: FeedbackProps): JSX.Element => (
  <div className={`notice ${props.ok ? "success" : "error"}`}>{props.message}</div>
)
