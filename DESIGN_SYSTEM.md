# DarShana Design System Guide

## Overview

The DarShana Design System provides a unified, consistent approach to building UI components across the entire application. This guide covers design tokens, reusable components, and best practices for maintaining visual consistency.

## Design Tokens

### Color Palette

**Primary Colors:**
- **Orange Primary**: `#EA580C` - Main CTA and interactive elements
- **Teal Secondary**: `#0D7377` - Alternative actions and accents

**Neutral Colors:**
- **Stone Dark**: `#1E293B` - Headings and primary text
- **Stone Medium**: `#64748B` - Secondary text
- **Stone Light**: `#F1F5F9` - Backgrounds and borders

**Accent Colors:**
- **Deep Blue**: `#001F3F` - Premium sections, hero backgrounds
- **Purple**: `#6B21A8` - Gradient accents, special features

### Gradients

- **Hero Gradient**: `linear-gradient(135deg, #001F3F, #6B21A8)` - Page headers
- **Accent Gradient**: `linear-gradient(to right, #EA580C, #0D7377)` - Cards, CTAs

### Typography

- **H1**: Serif, Bold, 3rem
- **H2**: Sans-serif, Bold, 1.875rem
- **H3**: Sans-serif, Bold, 1.5rem
- **Body Large**: Sans-serif, Semibold, 1.125rem
- **Body Regular**: Sans-serif, Regular, 1rem
- **Body Small**: Sans-serif, Regular, 0.875rem
- **Label**: Sans-serif, Semibold, 0.75rem, Uppercase, Tracked

### Spacing Scale

- `xs`: 0.25rem (4px)
- `sm`: 0.5rem (8px)
- `md`: 1rem (16px)
- `lg`: 1.5rem (24px)
- `xl`: 2rem (32px)
- `2xl`: 2.5rem (40px)
- `3xl`: 3rem (48px)

### Border Radius

- `sm`: 0.375rem (6px) - Small elements
- `md`: 0.5rem (8px) - Standard inputs
- `lg`: 0.75rem (12px) - Cards
- `full`: 9999px - Pills, circular elements

### Shadows

- **sm**: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- **md**: `0 4px 6px -1px rgba(0, 0, 0, 0.1)`
- **lg**: `0 10px 15px -3px rgba(0, 0, 0, 0.1)`
- **xl**: `0 20px 25px -5px rgba(0, 0, 0, 0.1)`

## Reusable Components

### StyledButton

A flexible button component with multiple variants and sizes.

**Props:**
```typescript
interface StyledButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}
```

**Usage:**
```tsx
import StyledButton from '@/components/StyledButton';

// Primary button (default)
<StyledButton onClick={() => console.log('clicked')}>
  Book Now
</StyledButton>

// Secondary button
<StyledButton variant="secondary" size="lg">
  Learn More
</StyledButton>

// Outline button
<StyledButton variant="outline">
  Cancel
</StyledButton>

// Ghost button
<StyledButton variant="ghost">
  Skip
</StyledButton>

// Loading state
<StyledButton isLoading variant="primary">
  Submitting...
</StyledButton>
```

**Variants:**
- **primary**: Orange background, white text - for main actions
- **secondary**: Teal background, white text - for alternative actions
- **outline**: Border and text in orange - for secondary interactions
- **ghost**: Minimal style, hover effect - for tertiary actions

### StyledCard

A container component with multiple visual styles.

**Props:**
```typescript
interface StyledCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass';
  children: React.ReactNode;
}
```

**Usage:**
```tsx
import StyledCard from '@/components/StyledCard';

// Default card (most common)
<StyledCard>
  <h3 className="font-bold text-stone-800">Trip Summary</h3>
  <p className="text-stone-600">Details of your upcoming trip</p>
</StyledCard>

// Elevated card (featured content)
<StyledCard variant="elevated">
  <h3 className="font-bold text-stone-800">Premium Destination</h3>
  <p className="text-stone-600">Exclusive eco-friendly packages</p>
</StyledCard>

// Glass card (modern, overlay style)
<StyledCard variant="glass">
  <h3 className="font-bold">Featured Destination</h3>
  <p>Discover amazing local experiences</p>
</StyledCard>
```

**Variants:**
- **default**: White background with subtle shadow - standard content
- **elevated**: Higher shadow for prominence - featured content, highlights
- **glass**: Glassmorphism effect - overlays, modern sections

### StyledInput

A form input component with labels, validation, and help text.

**Props:**
```typescript
interface StyledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'outline';
  label?: string;
  error?: string;
  helpText?: string;
}
```

**Usage:**
```tsx
import StyledInput from '@/components/StyledInput';

// Basic input
<StyledInput
  label="Destination"
  placeholder="Enter destination..."
  type="text"
/>

// With help text
<StyledInput
  label="Email"
  type="email"
  helpText="We'll never share your email"
  placeholder="you@example.com"
/>

// With error state
<StyledInput
  label="Phone"
  type="tel"
  error="Invalid phone number"
  value={phoneNumber}
  onChange={(e) => setPhoneNumber(e.target.value)}
/>

// Outline variant
<StyledInput
  variant="outline"
  label="Search"
  placeholder="Search destinations..."
/>
```

**Variants:**
- **default**: Subtle border with focus ring
- **outline**: Bold border for emphasis

## Design System Configuration

Access design tokens programmatically via `src/config/designSystem.ts`:

```tsx
import { components } from '@/config/designSystem';

// Use in components
<div className={components.container}>
  <h1 className={components.sectionTitle}>Welcome</h1>
  <p className={components.sectionSubtitle}>Explore sustainable travel</p>
</div>
```

**Available exports:**
- `colors`: Color palette
- `gradients`: Predefined gradients
- `typography`: Text styles
- `spacing`: Spacing utilities
- `components`: Component-level classes

## Best Practices

### 1. Use Reusable Components First
Always prefer `StyledButton`, `StyledCard`, and `StyledInput` over inline styling.

```tsx
// ✅ Good
<StyledButton variant="primary">Book Now</StyledButton>

// ❌ Avoid
<button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full">Book Now</button>
```

### 2. Color Consistency
Use only the defined color palette. Never introduce new colors.

```tsx
// ✅ Good
<div className="text-orange-600">Success</div>

// ❌ Avoid
<div className="text-amber-500">Success</div>
```

### 3. Typography Hierarchy
Maintain proper text hierarchy using predefined sizes.

```tsx
// ✅ Good
<h1 className={components.sectionTitle}>Destinations</h1>
<p className="text-base text-stone-700">Popular eco-friendly places</p>

// ❌ Avoid
<h1 className="text-2xl font-normal">Destinations</h1>
<p className="text-lg text-gray-500">Popular eco-friendly places</p>
```

### 4. Spacing Consistency
Use the spacing scale for all margins and padding.

```tsx
// ✅ Good - Using 24px (lg)
<div className="mb-6 p-6">
  Content here
</div>

// ❌ Avoid - Random spacing
<div className="mb-7 p-5">
  Content here
</div>
```

### 5. Shadow Usage
Use predefined shadows for depth hierarchy.

```tsx
// ✅ Good
<div className="shadow-md">Default card</div>
<div className="shadow-lg">Elevated card</div>

// ❌ Avoid
<div className="shadow-sm">Too subtle</div>
```

## Component Examples

### Example 1: Booking Card
```tsx
<StyledCard variant="elevated">
  <h3 className="text-lg font-bold text-stone-800 mb-4">Jaipur Tour</h3>
  <p className="text-stone-600 mb-6">7 days eco-friendly city tour</p>
  <div className="flex gap-3">
    <StyledButton variant="primary" size="md">Book Now</StyledButton>
    <StyledButton variant="ghost">Learn More</StyledButton>
  </div>
</StyledCard>
```

### Example 2: Search Form
```tsx
<div className={`${components.container} py-8`}>
  <h2 className={components.sectionTitle}>Find Your Trip</h2>
  <form className="flex flex-col gap-4">
    <StyledInput
      label="Starting Location"
      placeholder="Where from?"
      required
    />
    <StyledInput
      label="Destination"
      placeholder="Where to?"
      required
    />
    <StyledButton variant="primary" size="lg">
      Search Trips
    </StyledButton>
  </form>
</div>
```

### Example 3: Stats Display
```tsx
<div className="grid grid-cols-3 gap-4">
  <StyledCard>
    <p className="text-stone-600 text-sm mb-2">Trips Taken</p>
    <p className="text-3xl font-bold text-orange-600">24</p>
  </StyledCard>
  <StyledCard>
    <p className="text-stone-600 text-sm mb-2">CO₂ Saved</p>
    <p className="text-3xl font-bold text-teal-700">2.4T</p>
  </StyledCard>
  <StyledCard>
    <p className="text-stone-600 text-sm mb-2">Rewards Earned</p>
    <p className="text-3xl font-bold text-blue-900">1,250</p>
  </StyledCard>
</div>
```

## View the Style Guide

Visit `/style-guide` to see all design tokens, components, and patterns in action. This page demonstrates:
- All button variants and sizes
- Card variations
- Complete color palette
- Typography hierarchy
- Form elements
- Badge styles

## Extending the Design System

### Adding New Colors

Update `src/config/designSystem.ts`:
```typescript
colors: {
  // ... existing colors
  success: '#10B981',
  warning: '#F59E0B',
},
```

### Adding New Component Styles

Create a new styled component in `src/components/`:
```tsx
export const StyledBadge: React.FC<StyledBadgeProps> = ({
  variant = 'primary',
  children,
  ...props
}) => {
  // Implementation
};
```

## Accessibility Considerations

All reusable components follow WCAG 2.1 AA standards:
- ✅ Proper semantic HTML (buttons are `<button>`, links are `<a>`)
- ✅ Focus indicators for keyboard navigation
- ✅ Color contrast ratios ≥ 4.5:1
- ✅ Error messages clearly associated with inputs
- ✅ Loading states with accessible text

## Migration Guide

Refactor existing components to use the design system:

1. Replace hardcoded button styles with `StyledButton`
2. Replace card containers with `StyledCard`
3. Replace form inputs with `StyledInput`
4. Use `designSystem` config for consistent spacing/colors
5. Test responsive behavior at all breakpoints

## Questions or Updates?

Contact the design system maintainer or update this guide as the system evolves.
