import DialogModal from '@components/DialogModal'
import FormSendTip from './FormSendTip'

export const DialogSendTip = (props) => {
  return (
    <DialogModal api={props.api} title="Send a tip" description="Select the token you want to send as a tip.">
      <FormSendTip />
    </DialogModal>
  )
}

export default DialogSendTip
