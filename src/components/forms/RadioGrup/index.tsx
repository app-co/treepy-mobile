import { color } from "@/styles/color"
import { Radio } from "native-base"

export type TRadios = { text: string, value: string }
interface I {
  radios: TRadios[]
  alin?: 'row' | 'column'
  name?: string
  selected: (value: string) => void
}
export function RadioGrup({ radios, selected, name = 'my group', alin = 'column' }: I) {

  return (
    <Radio.Group onChange={h => selected(h)} name={name} defaultValue="0" direction={alin} space={2} >
      {radios.map(h => (
        <Radio size={'sm'} _checked={{ borderColor: color.focus.regular, _icon: { color: color.focus.regular } }} colorScheme={'primary'} value={h.value} >{h.text}</Radio>
      ))}
    </Radio.Group>
  )
}