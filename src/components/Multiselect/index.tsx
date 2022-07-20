import MultiSelect from '@digichanges/solid-multiselect'
import { omitProps } from 'solid-use'

export const Multiselect = (props) => {
  return (
    <div class={`multiselect-custom ${props.class ?? ''}`}>
      <MultiSelect {...omitProps(props, ['scale', 'class', 'intent'])} {...props} />
    </div>
  )
}

export default Multiselect
