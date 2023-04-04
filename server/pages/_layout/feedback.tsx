import { React } from "../../../deps.ts"

export type FeedbackProps = {
  ok: boolean
  message: string
}

export default (props: FeedbackProps): JSX.Element => (
  <div className={`notice ${props.ok ? "success" : "error"}`}>{props.message}</div>
)
