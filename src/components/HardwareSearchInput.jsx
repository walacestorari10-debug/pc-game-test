import { useEffect, useId, useMemo, useRef, useState } from 'react'

const maxResults = 20

function normalizeSearch(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getHardwareName(item) {
  return typeof item === 'string' ? item : item.name
}

function getHardwareAliases(name) {
  const normalizedName = normalizeSearch(name)
  const aliases = []

  if (normalizedName.includes('rtx') || normalizedName.includes('gtx')) {
    aliases.push('nvidia', 'geforce')
  }

  if (normalizedName.includes('rx ') || normalizedName.startsWith('rx')) {
    aliases.push('amd', 'radeon')
  }

  if (normalizedName.includes('ryzen')) {
    aliases.push('amd')
  }

  if (normalizedName.includes('core i')) {
    aliases.push('intel')
  }

  return aliases.join(' ')
}

function HardwareSearchInput({
  label,
  placeholder,
  items,
  value,
  onChange,
  icon,
  isUpdated,
  getItemLabel = getHardwareName,
  getItemValue = getItemLabel,
  getItemMeta = (item) => item.tier,
  getSearchText,
  emptyMessage = 'Nenhum hardware encontrado',
}) {
  const inputId = useId()
  const listId = useId()
  const wrapperRef = useRef(null)
  const [draftQuery, setDraftQuery] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const selectedItem = items.find((item) => getItemValue(item) === value)
  const selectedLabel = selectedItem ? getItemLabel(selectedItem) : value || ''
  const query = isEditing ? draftQuery : selectedLabel
  const normalizedQuery = normalizeSearch(query)
  const hasValidSelection = Boolean(value) && !isEditing
  const showSelectionWarning =
    isEditing && Boolean(query.trim()) && !hasValidSelection

  const filteredItems = useMemo(() => {
    const matches = items.filter((item) => {
      const itemLabel = getItemLabel(item)
      const rawSearchText =
        getSearchText?.(item) ??
        [itemLabel, item.brand, item.tier, getHardwareAliases(itemLabel)]
          .filter(Boolean)
          .join(' ')
      const searchText = normalizeSearch(rawSearchText)
      const compactSearchText = searchText.replace(/\s/g, '')
      const compactQuery = normalizedQuery.replace(/\s/g, '')

      return (
        !normalizedQuery ||
        searchText.includes(normalizedQuery) ||
        compactSearchText.includes(compactQuery)
      )
    })

    return matches.slice(0, maxResults)
  }, [getItemLabel, getSearchText, items, normalizedQuery])

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  const selectItem = (item) => {
    const itemValue = getItemValue(item)

    setDraftQuery('')
    setIsEditing(false)
    setIsOpen(false)
    onChange(itemValue)
  }

  const handleInputChange = (event) => {
    const nextQuery = event.target.value

    setDraftQuery(nextQuery)
    setIsEditing(true)
    setIsOpen(true)

    if (nextQuery !== value) {
      onChange('')
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsOpen(false)
      return
    }

    if (event.key === 'Enter') {
      if (isOpen && filteredItems.length > 0) {
        event.preventDefault()
        selectItem(filteredItems[0])
        return
      }

      if (!hasValidSelection) {
        event.preventDefault()
      }
    }
  }

  return (
    <div
      className={`setup-select setup-hardware-search ${
        value ? 'is-selected' : ''
      } ${isUpdated ? 'is-updated' : ''} ${
        showSelectionWarning ? 'has-warning' : ''
      }`}
      ref={wrapperRef}
    >
      <label className="setup-label" htmlFor={inputId}>
        {icon && (
          <span className="setup-field-icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <span>{label}</span>
      </label>

      <div className="hardware-search-control">
        <input
          id={inputId}
          type="search"
          value={query}
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-controls={listId}
          aria-expanded={isOpen}
          aria-invalid={showSelectionWarning}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />

        {isOpen && (
          <div className="hardware-search-results" id={listId} role="listbox">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const itemLabel = getItemLabel(item)
                const itemValue = getItemValue(item)
                const itemMeta = getItemMeta(item)

                return (
                  <button
                    className="hardware-search-option"
                    type="button"
                    role="option"
                    aria-selected={itemValue === value}
                    key={itemValue}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectItem(item)}
                  >
                    <span>{itemLabel}</span>
                    {itemMeta && <small>{itemMeta}</small>}
                  </button>
                )
              })
            ) : (
              <p className="hardware-search-empty">{emptyMessage}</p>
            )}
          </div>
        )}
      </div>

      {showSelectionWarning && (
        <p className="hardware-search-warning">Selecione uma opção da lista</p>
      )}
    </div>
  )
}

export default HardwareSearchInput
