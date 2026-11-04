// SOURCE: skills/composition-patterns/rules/state-decouple-implementation.md
// HASH: ccaf7a968dced1afd2f492fd626f99e7605bdc84fa02f889559725db0563d409
function ChannelComposer({ channelId }: { channelId: string }) {
  // UI component knows about global state implementation
  const state = useGlobalChannelState(channelId)
  const { submit, updateInput } = useChannelSync(channelId)

  return (
    <Composer.Frame>
      <Composer.Input
        value={state.input}
        onChange={(e) => updateInput(e.target.value)}
      />
      <Composer.Submit onClick={() => submit()} />
    </Composer.Frame>
  )
}

// ---- test scaffolding (not part of the exercise) ----
declare function useGlobalChannelState(channelId: string): { input: string }
declare function useChannelSync(channelId: string): { submit: () => void; updateInput: (value: string) => void }
declare const Composer: {
  Frame: (props: any) => null
  Input: (props: { value: string; onChange: (e: { target: { value: string } }) => void }) => null
  Submit: (props: any) => null
}
export {}
