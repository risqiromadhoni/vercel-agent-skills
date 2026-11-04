// SOURCE: skills/composition-patterns/rules/architecture-avoid-boolean-props.md
// HASH: 4f4b693372ca7f0e31fcb1e3b948b0c95526a968e5884b55e7927f508f5d6a7b
import { Composer } from './architecture-compound-components'

// Stand-in for the "also send to channel" field used by the thread composer.
function AlsoSendToChannelField({ id }: { id: string }) {
  return (
    <label data-channel={id}>
      <input type="checkbox" /> Also send to channel
    </label>
  )
}

// Channel composer
export function ChannelComposer() {
  return (
    <Composer.Frame>
      <Composer.Header />
      <Composer.Input />
      <Composer.Footer>
        <Composer.Attachments />
        <Composer.Formatting />
        <Composer.Emojis />
        <Composer.Submit />
      </Composer.Footer>
    </Composer.Frame>
  )
}

// Thread composer - adds "also send to channel" field
export function ThreadComposer({ channelId }: { channelId: string }) {
  return (
    <Composer.Frame>
      <Composer.Header />
      <Composer.Input />
      <AlsoSendToChannelField id={channelId} />
      <Composer.Footer>
        <Composer.Formatting />
        <Composer.Emojis />
        <Composer.Submit />
      </Composer.Footer>
    </Composer.Frame>
  )
}

// Edit composer - different footer actions
export function EditMessageComposer() {
  return (
    <Composer.Frame>
      <Composer.Input />
      <Composer.Footer>
        <Composer.Formatting />
        <Composer.Emojis />
        <Composer.CancelEdit />
        <Composer.SaveEdit />
      </Composer.Footer>
    </Composer.Frame>
  )
}
