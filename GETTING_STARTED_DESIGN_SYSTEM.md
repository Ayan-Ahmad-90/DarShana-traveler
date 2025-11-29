# 🚀 Getting Started with DarShana Design System

Welcome! This guide will help you quickly get up and running with the Design System in just 5 minutes.

## What is the Design System?

A unified set of **reusable UI components** and **design tokens** that ensure consistency across DarShana Travel.

## ⚡ 5-Minute Quick Start

### 1. View the Style Guide (2 min)
Start the dev server and visit the interactive showcase:

```bash
npm run dev
# Navigate to: http://localhost:5173/#/style-guide
```

You'll see:
- All button styles (primary, secondary, outline, ghost)
- Card variations (default, elevated, glass)
- Complete color palette
- Typography hierarchy
- Form elements

### 2. Find What You Need (1 min)

**Want to show something in UI?** → Pick the right component:

| Need | Component | Example |
|------|-----------|---------|
| A clickable action | `StyledButton` | "Book Now", "Submit" |
| A content container | `StyledCard` | Trip summary, user profile card |
| A text input | `StyledInput` | Search box, form fields |
| Design colors/spacing | `designSystem.ts` | Orange, padding, font sizes |

### 3. Use a Component (2 min)

**Example: Add a Button**

```tsx
import StyledButton from '@/components/StyledButton';

export default function MyPage() {
  return (
    <div>
      <StyledButton variant="primary" onClick={() => alert('Clicked!')}>
        Click Me
      </StyledButton>
    </div>
  );
}
```

That's it! The component handles styling, sizing, and interactions automatically.

---

## 📚 Documentation by Use Case

### "I need to add a button"
→ Use `StyledButton`
→ Variants: `primary` (orange) | `secondary` (teal) | `outline` | `ghost`
→ Sizes: `sm` | `md` | `lg`

```tsx
<StyledButton variant="primary" size="lg">Book Now</StyledButton>
```

### "I need a content card"
→ Use `StyledCard`
→ Variants: `default` | `elevated` | `glass`

```tsx
<StyledCard variant="elevated">
  <h3>Trip Title</h3>
  <p>Trip description</p>
</StyledCard>
```

### "I need a form input"
→ Use `StyledInput`
→ Can add label, error, help text

```tsx
<StyledInput 
  label="Email" 
  placeholder="you@example.com"
  error={emailError}
  helpText="We'll never share your email"
/>
```

### "I need to use colors/spacing"
→ Use `designSystem.ts`

```tsx
import { components } from '@/config/designSystem';

<div className={components.container}>
  <h1 className={components.sectionTitle}>Welcome</h1>
</div>
```

---

## 🎨 Color Palette

**Orange** (#EA580C) - Main action buttons, highlights
**Teal** (#0D7377) - Secondary actions, eco-friendly elements  
**Stone Gray** (#1E293B, #F1F5F9) - Text, backgrounds, borders
**Deep Blue** (#001F3F) - Hero sections, premium content
**Purple** (#6B21A8) - Gradients, special features

---

## 📏 Spacing Scale

Use these spacing values for consistency:

```
xs: 4px   (very small gaps)
sm: 8px   (small gaps)
md: 16px  (default, most common)
lg: 24px  (large gaps)
xl: 32px  (extra large)
2xl: 40px (huge gaps)
3xl: 48px (massive gaps)
```

Example with Tailwind: `mb-4` (md), `p-6` (lg), `gap-8` (xl)

---

## ✅ Common Patterns

### Pattern 1: Action Card
```tsx
<StyledCard variant="elevated" className="mb-6">
  <h3 className="font-bold text-stone-800 mb-3">Book a Trip</h3>
  <p className="text-stone-600 mb-4">Find eco-friendly tours near you</p>
  <div className="flex gap-3">
    <StyledButton variant="primary">Explore</StyledButton>
    <StyledButton variant="ghost">Learn More</StyledButton>
  </div>
</StyledCard>
```

### Pattern 2: Search Form
```tsx
<div className="space-y-4 p-6">
  <StyledInput label="From" placeholder="Starting location" />
  <StyledInput label="To" placeholder="Destination" />
  <StyledButton variant="primary" type="submit" size="lg" className="w-full">
    Find Routes
  </StyledButton>
</div>
```

### Pattern 3: Stats Display
```tsx
<div className="grid grid-cols-3 gap-4">
  <StyledCard>
    <p className="text-stone-600 text-sm">Trips</p>
    <p className="text-3xl font-bold text-orange-600">24</p>
  </StyledCard>
  <StyledCard>
    <p className="text-stone-600 text-sm">CO₂ Saved</p>
    <p className="text-3xl font-bold text-teal-700">2.4T</p>
  </StyledCard>
  {/* ... more cards */}
</div>
```

---

## 🔗 Quick Links

| Resource | Purpose | When to Use |
|----------|---------|------------|
| **/#/style-guide** | Visual showcase | Looking for inspiration or examples |
| **DESIGN_SYSTEM_QUICK_REFERENCE.md** | Developer cheat sheet | Need quick lookup of component patterns |
| **DESIGN_SYSTEM.md** | Complete guide | Learning how to use design system properly |
| **Component Files** | Source code | Need exact TypeScript props/types |
| **designSystem.ts** | Design tokens | Finding colors, spacing, typography |

---

## 🎓 Learning Path

### Level 1: Beginner (15 min)
1. Read this "Getting Started" guide
2. Visit `/#/style-guide` in browser
3. Copy a simple example into your page

### Level 2: Intermediate (30 min)
1. Read DESIGN_SYSTEM_QUICK_REFERENCE.md
2. Try using 2-3 different components
3. Experiment with variants and sizes

### Level 3: Advanced (1 hour)
1. Read full DESIGN_SYSTEM.md
2. Refactor an existing page to use components
3. Learn when to extend the design system

---

## ❓ FAQ

**Q: Can I use Tailwind classes directly?**
A: Yes, but prefer components for UI elements. Use Tailwind for layouts and utilities.

**Q: What if I don't like how something looks?**
A: You can pass `className` to extend styles:
```tsx
<StyledButton className="custom-style">Custom</StyledButton>
```

**Q: Can I create new component variants?**
A: Yes! Update the component file and add documentation in DESIGN_SYSTEM.md.

**Q: How do I know which spacing value to use?**
A: Reference the spacing scale in DESIGN_SYSTEM_QUICK_REFERENCE.md. Default is `md (16px)`.

**Q: Can I use different colors?**
A: Use only colors from designSystem.ts. For new colors, update designSystem.ts and DESIGN_SYSTEM.md.

**Q: Are components mobile-friendly?**
A: Yes! All components are responsive. Test at different screen sizes.

---

## 🧪 Testing Your Work

After adding components:

1. **Build** - Check for errors:
   ```bash
   npm run build
   ```

2. **View** - Start dev server:
   ```bash
   npm run dev
   ```

3. **Validate** - Check in browser:
   - Does it look right?
   - Is it responsive (mobile/tablet/desktop)?
   - Does it follow the color scheme?

---

## 📖 Component Reference

### StyledButton
```tsx
<StyledButton 
  variant="primary|secondary|outline|ghost"
  size="sm|md|lg"
  isLoading={boolean}
  disabled={boolean}
  onClick={handler}
>
  Button Text
</StyledButton>
```

### StyledCard
```tsx
<StyledCard 
  variant="default|elevated|glass"
  className="additional classes"
>
  Card Content
</StyledCard>
```

### StyledInput
```tsx
<StyledInput
  label="Label text"
  type="text|email|password|tel"
  placeholder="Placeholder..."
  value={value}
  onChange={handler}
  error="Error message"
  helpText="Help text"
  variant="default|outline"
/>
```

---

## 🚀 Next Steps

1. **Explore** - Visit `/#/style-guide` and play with components
2. **Implement** - Try using a component in a simple page
3. **Learn** - Read DESIGN_SYSTEM_QUICK_REFERENCE.md when you need something specific
4. **Contribute** - Help migrate other pages to design system

---

## 💡 Pro Tips

✨ **Tip 1**: Always check the style guide first before creating custom styling

✨ **Tip 2**: Use `space-y-4` and `flex gap-4` for consistent spacing between elements

✨ **Tip 3**: Copy working examples from other pages that use design system

✨ **Tip 4**: Test your changes on mobile by resizing the browser window

✨ **Tip 5**: Keep component usage consistent within the same page

---

## 🆘 Getting Help

**Stuck?**
1. Check DESIGN_SYSTEM_QUICK_REFERENCE.md for quick answers
2. Look at /#/style-guide for visual examples
3. Review DESIGN_SYSTEM.md for detailed explanations
4. Check similar pages for implementation patterns

**Found a bug?**
1. Describe what went wrong
2. Include screenshots if helpful
3. Open a GitHub issue with label `design-system`

**Have a suggestion?**
1. Discuss in team channel
2. Document the use case
3. Include examples of desired outcome

---

## 📞 Design System Maintainer

Questions about the design system? Reach out to:
- [Team/Person Responsible]
- Check GitHub issues with label `design-system`
- Team design-system channel

---

## ✨ You're Ready!

You now know enough to start using the Design System. Go build beautiful, consistent UI! 🎉

**Next step**: Visit `/#/style-guide` and pick a component to use.

Happy coding! 🚀

---

**Questions? Check:**
- 📖 DESIGN_SYSTEM_QUICK_REFERENCE.md
- 📚 DESIGN_SYSTEM.md
- 🎨 /#/style-guide (in browser)
