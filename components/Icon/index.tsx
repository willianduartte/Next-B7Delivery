import Card from './card.svg'
import Checked from './checked.svg'
import Cupom from './cupom.svg'
import Location from './location.svg'
import MailSent from './mailSent.svg'
import Money from './money.svg'
import RightArrow  from './rightArrow.svg'

type Props = {
  icon: string
  color: string
  width: number
  height: number
}

export const Icon = ({icon, color, height, width}: Props) => {
  return (
    <div style={{ width, height }}>
      {icon === 'card' && <Card color={color}/>}
      {icon === 'checked' && <Checked color={color}/>}
      {icon === 'cupom' && <Cupom color={color}/>}
      {icon === 'location' && <Location color={color}/>}
      {icon === 'mailSent' && <MailSent color={color}/>}
      {icon === 'money' && <Money color={color}/>}
      {icon === 'rightArrow' && <RightArrow color={color}/>}
    </div>
  )
}