# Theme QA Checklist

**Version:** 1.0.0  
**Last Updated:** 2025-12-17  
**Status:** Active

Use this checklist when adding new themes or updating existing ones to ensure visual consistency and accessibility.

## Pre-Release Checklist

### Visual Regression Testing

- [ ] **Home Page**
  - [ ] Hero section renders correctly
  - [ ] Navigation sidebar displays properly
  - [ ] Profile sidebar renders correctly
  - [ ] All sections visible and readable
  - [ ] Buttons and links have proper contrast

- [ ] **Portfolio Pages**
  - [ ] Portfolio listing grid displays correctly
  - [ ] Project cards have proper borders and backgrounds
  - [ ] Project detail pages render correctly
  - [ ] Image galleries display properly
  - [ ] Tags and badges are readable

- [ ] **Blog Pages**
  - [ ] Blog listing displays correctly
  - [ ] Blog post pages render properly
  - [ ] Rich text content is readable
  - [ ] Code blocks have proper styling
  - [ ] Categories and tags are visible

- [ ] **Admin Dashboard**
  - [ ] Dashboard overview renders correctly
  - [ ] Navigation menu is readable
  - [ ] Tables display properly
  - [ ] Forms are usable
  - [ ] Buttons and actions are visible

- [ ] **Admin CRUD Pages**
  - [ ] All CRUD pages render correctly
  - [ ] Form inputs are readable
  - [ ] Validation messages are visible
  - [ ] Toast notifications display properly
  - [ ] Status badges are readable

### Accessibility Checks

- [ ] **Color Contrast**
  - [ ] Text meets WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text)
  - [ ] Interactive elements have sufficient contrast
  - [ ] Focus indicators are visible
  - [ ] Error states are distinguishable

- [ ] **Visual Indicators**
  - [ ] Success states use green/emerald colors
  - [ ] Error states use red/danger colors
  - [ ] Warning states use amber/yellow colors
  - [ ] Info states use blue/sky colors

- [ ] **Interactive Elements**
  - [ ] Buttons have clear hover states
  - [ ] Links are distinguishable from text
  - [ ] Form inputs have visible borders
  - [ ] Disabled states are clearly indicated

### Cross-Browser Testing

- [ ] **Chrome/Edge** (Chromium)
- [ ] **Firefox**
- [ ] **Safari** (if available)
- [ ] **Mobile Safari** (iOS)
- [ ] **Chrome Mobile** (Android)

### Responsive Design

- [ ] **Mobile** (< 768px)
  - [ ] Layout adapts correctly
  - [ ] Navigation is accessible
  - [ ] Text is readable
  - [ ] Forms are usable

- [ ] **Tablet** (768px - 1024px)
  - [ ] Layout adapts correctly
  - [ ] Sidebars behave properly
  - [ ] Grid layouts adjust

- [ ] **Desktop** (> 1024px)
  - [ ] Full layout displays correctly
  - [ ] Three-column layout works
  - [ ] Hover states function

### Theme-Specific Checks

- [ ] **Dark Themes**
  - [ ] No pure white backgrounds (reduce eye strain)
  - [ ] Sufficient contrast for readability
  - [ ] Accent colors pop appropriately

- [ ] **Light Themes**
  - [ ] No pure black text (reduce eye strain)
  - [ ] Backgrounds are not too bright
  - [ ] Borders provide sufficient separation

- [ ] **Gradient Themes**
  - [ ] Gradients don't interfere with readability
  - [ ] Text remains legible over gradients
  - [ ] Components maintain clarity

## Testing Workflow

1. **Apply Theme**
   - Navigate to `/admin/settings/theme`
   - Click "Apply" on the theme to test

2. **Screenshot Baseline** (if using visual regression tools)
   - Capture screenshots of key pages
   - Compare against previous theme versions

3. **Manual Testing**
   - Navigate through all major pages
   - Test interactive elements
   - Verify accessibility

4. **Document Issues**
   - Note any visual bugs
   - Document contrast issues
   - Track responsive breakpoint problems

## Common Issues

### Low Contrast
- **Symptom**: Text is hard to read
- **Fix**: Adjust `foreground` and `background` tokens
- **Check**: Use contrast checker tools

### Missing Borders
- **Symptom**: Components blend together
- **Fix**: Ensure `border` token has sufficient contrast
- **Check**: Verify card and input borders

### Invisible Focus States
- **Symptom**: Keyboard navigation unclear
- **Fix**: Add visible focus ring using `accent-primary`
- **Check**: Tab through interactive elements

### Poor Status Colors
- **Symptom**: Success/error states unclear
- **Fix**: Ensure `success`, `danger`, `warning` tokens are distinct
- **Check**: Test toast notifications and badges

## Tools

- **Contrast Checker**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- **Color Blindness Simulator**: [Toptal Color Blind Filter](https://www.toptal.com/designers/colorfilter)
- **Browser DevTools**: Use for responsive testing
- **Lighthouse**: Run accessibility audits

## Sign-Off

Before marking a theme as production-ready:

- [ ] All visual regression tests pass
- [ ] Accessibility checks pass
- [ ] Cross-browser testing complete
- [ ] Responsive design verified
- [ ] Theme-specific checks complete
- [ ] Documentation updated

**Reviewed By:** _______________  
**Date:** _______________

