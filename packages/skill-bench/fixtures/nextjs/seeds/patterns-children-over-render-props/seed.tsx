// SOURCE: skills/composition-patterns/rules/patterns-children-over-render-props.md
// HASH: 2c83c3671c7a67fa67b752a308e8df36ed4e65370e78df3beec57bc6810c1b15
export function Composer({
  renderHeader,
  renderFooter,
  renderActions,
}: {
  renderHeader?: () => React.ReactNode
  renderFooter?: () => React.ReactNode
  renderActions?: () => React.ReactNode
}) {
  return (
    <form>
      {renderHeader?.()}
      <Input />
      {renderFooter ? renderFooter() : <DefaultFooter />}
      {renderActions?.()}
    </form>
  )
}

// Usage is awkward and inflexible
export function ComposerUsage() {
  return (
    <Composer
      renderHeader={() => <CustomHeader />}
      renderFooter={() => (
        <>
          <Formatting />
          <Emojis />
        </>
      )}
      renderActions={() => <SubmitButton />}
    />
  )
}

// ---- test scaffolding (not part of the exercise) ----
function Input() {
  return null
}

function DefaultFooter() {
  return null
}

function CustomHeader() {
  return null
}

function Formatting() {
  return null
}

function Emojis() {
  return null
}

function SubmitButton() {
  return null
}
