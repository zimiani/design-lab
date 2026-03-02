import { forwardRef } from 'react'
import { RiSearchLine } from '@remixicon/react'
import { registerComponent } from '../registry'

export type SearchBarProps = React.InputHTMLAttributes<HTMLInputElement>

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className = '', ...inputProps }, ref) => {
    return (
      <div data-component="SearchBar" className={`flex items-center gap-4 py-4 border-b border-[var(--color-border-default)] bg-white ${className}`}>
        <RiSearchLine size={20} className="shrink-0 text-[var(--color-content-tertiary)]" />
        <input
          ref={ref}
          className="flex-1 text-[15px] text-[var(--color-content-primary)] placeholder:text-[var(--color-content-tertiary)] border-none outline-none bg-transparent"
          {...inputProps}
        />
      </div>
    )
  },
)

SearchBar.displayName = 'SearchBar'

export default SearchBar

registerComponent({
  name: 'SearchBar',
  category: 'inputs',
  description: 'Search input with icon. Use at the top of lists and asset pages for filtering content.',
  component: SearchBar,
  props: [
    { name: 'placeholder', type: 'string', required: false, description: 'Placeholder text' },
    { name: 'value', type: 'string', required: false, description: 'Input value' },
    { name: 'onChange', type: '(e: ChangeEvent) => void', required: false, description: 'Change handler' },
  ],
})
