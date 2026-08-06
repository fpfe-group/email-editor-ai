import { describe, expect, it } from 'vitest'
import { PROPERTY_MAP } from '../property-definitions'
import type { EmailNodeType, PropertyDefinition } from '../../types'

function getPropertyKeys(type: EmailNodeType): string[] {
  return (PROPERTY_MAP[type] || []).map((property) => property.key)
}

function getAllProperties(): PropertyDefinition[] {
  return Object.values(PROPERTY_MAP).flatMap((properties) => properties || [])
}

function getPropertyLabel(type: EmailNodeType, key: string): string | undefined {
  return (PROPERTY_MAP[type] || []).find((property) => property.key === key)?.label
}

describe('PROPERTY_MAP spacing and background controls', () => {
  it('does not expose margin controls', () => {
    expect(getAllProperties().some((property) => property.key.startsWith('margin'))).toBe(false)
  })

  it('shows container background controls with the container background label', () => {
    expect(getPropertyKeys('mj-text')).not.toContain('background-color')
    expect(getPropertyLabel('mj-text', 'container-background-color')).toBe('prop_container_background')
    expect(getPropertyLabel('mj-image', 'container-background-color')).toBe('prop_container_background')
    expect(getPropertyLabel('mj-divider', 'container-background-color')).toBe('prop_container_background')
    expect(getPropertyLabel('mj-spacer', 'container-background-color')).toBe('prop_container_background')
  })

  it('exposes border radius only on MJML nodes that support it', () => {
    const supportedRadiusKeys: Partial<Record<EmailNodeType, string[]>> = {
      'mj-section': ['border-radius'],
      'mj-column': ['border-radius', 'inner-border-radius'],
      'mj-image': ['border-radius'],
      'mj-button': ['border-radius'],
      'mj-social': ['border-radius'],
      'mj-social-element': ['border-radius'],
      'mj-hero': ['border-radius'],
      'mj-wrapper': ['border-radius'],
    }

    for (const [type, keys] of Object.entries(supportedRadiusKeys) as Array<[EmailNodeType, string[]]>) {
      expect(getPropertyKeys(type)).toEqual(expect.arrayContaining(keys))
    }

    for (const type of ['mj-body', 'mj-text', 'mj-divider', 'mj-spacer'] as EmailNodeType[]) {
      expect(getPropertyKeys(type)).not.toContain('border-radius')
    }
  })

  it('exposes supported spacing and background controls on editable MJML nodes', () => {
    const expectedKeys: Partial<Record<EmailNodeType, string[]>> = {
      'mj-section': ['background-color', 'padding'],
      'mj-column': ['background-color', 'inner-background-color', 'padding'],
      'mj-text': ['container-background-color', 'padding'],
      'mj-image': ['container-background-color', 'padding'],
      'mj-button': ['background-color', 'inner-padding', 'padding'],
      'mj-divider': ['container-background-color', 'padding'],
      'mj-spacer': ['container-background-color', 'padding'],
      'mj-social': [
        'container-background-color',
        'padding',
        'inner-padding',
        'icon-padding',
        'text-padding',
        'border-radius',
      ],
      'mj-social-element': ['background-color', 'padding', 'icon-padding', 'text-padding', 'border-radius'],
      'mj-hero': [
        'background-color',
        'inner-background-color',
        'padding',
        'inner-padding',
        'border-radius',
      ],
      'mj-wrapper': ['background-color', 'padding'],
    }

    for (const [type, keys] of Object.entries(expectedKeys) as Array<[EmailNodeType, string[]]>) {
      expect(getPropertyKeys(type)).toEqual(expect.arrayContaining(keys))
    }
  })
})
