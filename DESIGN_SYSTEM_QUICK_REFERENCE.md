# DarShana Design System - Quick Reference

## What's New?

We've implemented a **unified Design System** for DarShana Travel to ensure UI/UX consistency across the entire application.

## 🎨 Key Resources

| Resource | Path | Purpose |
|----------|------|---------|
| **Design System Guide** | `DESIGN_SYSTEM.md` | Complete documentation with usage examples |
| **Implementation Roadmap** | `DESIGN_SYSTEM_IMPLEMENTATION.md` | Summary of what's done and what's next |
| **Style Guide Page** | `/#/style-guide` | Interactive visual reference |
| **Design Config** | `src/config/designSystem.ts` | Centralized design tokens |

## 🧩 Styled Components

### 1. **StyledButton**
```tsx
import StyledButton from '@/components/StyledButton';

<StyledButton variant="primary">Book Now</StyledButton>
<StyledButton variant="secondary" size="lg">Learn More</StyledButton>
<StyledButton variant="outline">Cancel</StyledButton>
<StyledButton variant="ghost">Skip</StyledButton>
<StyledButton isLoading>Loading...</StyledButton>
```

**Variants**: `primary` | `secondary` | `outline` | `ghost`
**Sizes**: `sm` | `md` | `lg`

---

### 2. **StyledCard**
```tsx
import StyledCard from '@/components/StyledCard';

<StyledCard>Default card content</StyledCard>
<StyledCard variant="elevated">Featured content</StyledCard>
<StyledCard variant="glass">Modern overlay</StyledCard>
```

**Variants**: `default` | `elevated` | `glass`

---

### 3. **StyledInput**
```tsx
import StyledInput from '@/components/StyledInput';

<StyledInput label="Email" placeholder="you@example.com" />
<StyledInput label="Phone" error="Invalid format" />
<StyledInput label="Search" helpText="Type to filter..." />
```

**Props**: `label` | `error` | `helpText` | `variant`

---

## 🎯 Design Tokens

### Colors
```tsx
import { components } from '@/config/designSystem';

// Primary
Orange Primary: #EA580C
Teal Secondary: #0D7377

// Neutral
Stone Dark: #1E293B
Stone Light: #F1F5F9

// Accents
Deep Blue: #001F3F
Purple: #6B21A8
```

### Spacing Scale
```
xs (4px) → sm (8px) → md (16px) → lg (24px) → xl (32px) → 2xl (40px) → 3xl (48px)
```

### Typography
```
H1: Serif, Bold, 3rem
H2: Bold, 1.875rem
H3: Bold, 1.5rem
Body Large: Semibold, 1.125rem
Body Regular: Normal, 1rem
Body Small: Normal, 0.875rem
Label: Semibold, 0.75rem, Uppercase, Tracked
```

---

## ✨ Using Design System Config

```tsx
import { components } from '@/config/designSystem';

<div className={components.container}>
  <h1 className={components.sectionTitle}>Title</h1>
  <p className={components.sectionSubtitle}>Subtitle</p>
</div>
```

**Available**: `container` | `sectionTitle` | `sectionSubtitle` | `cardBase` | ...

---

## 📋 Common Patterns

### Button + Card
```tsx
<StyledCard variant="elevated">
  <h3 className="font-bold text-stone-800">Action Card</h3>
  <p className="text-stone-600 mb-4">Description text</p>
  <div className="flex gap-2">
    <StyledButton variant="primary">Primary</StyledButton>
    <StyledButton variant="ghost">Cancel</StyledButton>
  </div>
</StyledCard>
```

### Form
```tsx
<div className={components.container}>
  <h1 className={components.sectionTitle}>Sign Up</h1>
  <form className="space-y-4">
    <StyledInput label="Name" required />
    <StyledInput label="Email" type="email" required />
    <StyledButton variant="primary" type="submit">Submit</StyledButton>
  </form>
</div>
```

### Stats Display
```tsx
<div className="grid grid-cols-3 gap-4">
  {[
    { label: "Trips", value: "24", icon: "🌍" },
    { label: "CO₂ Saved", value: "2.4T", icon: "🌱" },
    { label: "Rewards", value: "1,250", icon: "🎁" },
  ].map(stat => (
    <StyledCard key={stat.label}>
      <p className="text-stone-600 text-sm">{stat.label}</p>
      <p className="text-3xl font-bold text-orange-600">{stat.value}</p>
    </StyledCard>
  ))}
</div>
```

---

## 🚀 Best Practices

### ✅ DO
- Use `StyledButton`, `StyledCard`, `StyledInput` for all UI elements
- Reference `designSystem.ts` for colors and spacing
- Maintain typography hierarchy using defined classes
- Keep consistent spacing using the scale (md, lg, xl)
- Use predefined color palette only

### ❌ DON'T
- Don't create custom buttons or cards with inline styles
- Don't introduce new colors outside the palette
- Don't use arbitrary spacing values like `p-7` or `mb-5`
- Don't mix Tailwind utility classes with component styles inconsistently
- Don't ignore accessibility guidelines (contrast, focus states)

---

## 📱 Responsive Design

```tsx
// Mobile-first
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <StyledCard>Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols</StyledCard>
</div>

// Hidden on mobile
<div className="hidden md:block">Only on tablet+</div>

// Stack on mobile
<div className="flex flex-col md:flex-row gap-4">
  <StyledButton>Mobile: full width</StyledButton>
  <StyledButton>Desktop: side by side</StyledButton>
</div>
```

---

## 🔍 View the Style Guide

**URL**: `http://localhost:5173/#/style-guide` (dev)

Shows all:
- Button variants
- Card types
- Color palette
- Typography hierarchy
- Form elements
- Badge styles

---

## 📚 Documentation

**Complete Guide**: See `DESIGN_SYSTEM.md`
- Detailed component props
- Real-world examples
- Accessibility notes
- Extension instructions
- Migration guide

**Implementation Plan**: See `DESIGN_SYSTEM_IMPLEMENTATION.md`
- What's complete (Phase 1 ✅)
- What's pending (Phases 2-4)
- Build status
- Success metrics

---

## 🎓 Learning Path

1. **Start**: Read this Quick Reference (5 min)
2. **Explore**: Visit `/#/style-guide` in browser (5 min)
3. **Deep Dive**: Review `DESIGN_SYSTEM.md` (15 min)
4. **Implement**: Use components in a page (10 min)
5. **Validate**: Check build passes (1 min)

---

## ❓ Common Questions

**Q: Can I use arbitrary Tailwind classes?**
A: Yes, but prefer design system tokens for consistency.

**Q: How do I add a new color?**
A: Update `src/config/designSystem.ts` and `DESIGN_SYSTEM.md`.

**Q: Which page should I refactor first?**
A: Start with components (Navbar, Footer), then pages (Home, Sustainable).

**Q: Where's the accessibility audit?**
A: All components follow WCAG 2.1 AA. See `DESIGN_SYSTEM.md`.

**Q: Can I modify component styles?**
A: Yes, via `className` prop (extends base styles).

---

## 🤝 Support

**Issues?** Check `DESIGN_SYSTEM.md` for troubleshooting.
**Suggestions?** Open GitHub issue with label `design-system`.
**Questions?** Review examples in `DESIGN_SYSTEM_IMPLEMENTATION.md`.

---

**Last Updated**: 2024
**Status**: ✅ Phase 1 Complete - Production Ready
**Next Phase**: Component Migration to Design System
