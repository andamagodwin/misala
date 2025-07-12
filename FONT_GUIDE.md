# Poppins Font Usage Guide

## Available Fonts
Your app now uses Poppins font family with these variants:
- **Poppins-Regular.ttf** - For normal text
- **Poppins-Medium.ttf** - For medium weight text (buttons, labels)
- **Poppins-Bold.ttf** - For headings and emphasis

## Removed Fonts
- ~~Poppins-Italic.ttf~~ - Removed (rarely used)
- ~~Poppins-SemiBold.ttf~~ - Removed (Medium and Bold cover most needs)

## Usage Methods

### 1. Using CSS Classes (Recommended)
```tsx
// Global default (already set)
<Text className="text-base">Regular text</Text>

// Medium weight
<Text className="font-medium">Medium weight text</Text>

// Bold weight
<Text className="font-bold">Bold text</Text>
```

### 2. Using Style Props
```tsx
// Regular
<Text style={{ fontFamily: 'Poppins-Regular' }}>Regular text</Text>

// Medium
<Text style={{ fontFamily: 'Poppins-Medium' }}>Medium text</Text>

// Bold
<Text style={{ fontFamily: 'Poppins-Bold' }}>Bold text</Text>
```

### 3. Using Tailwind Font Classes
```tsx
// These are configured in tailwind.config.js
<Text className="font-sans">Regular (default)</Text>
<Text className="font-medium">Medium weight</Text>
<Text className="font-bold">Bold weight</Text>
```

## Common Use Cases

### Headers/Titles
```tsx
<Text style={{ fontFamily: 'Poppins-Bold' }} className="text-2xl text-gray-800">
  Page Title
</Text>
```

### Button Text
```tsx
<Text style={{ fontFamily: 'Poppins-Medium' }} className="text-white">
  Button Text
</Text>
```

### Body Text
```tsx
<Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-600">
  Regular body text
</Text>
```

### Tab Labels (Already configured)
The tab labels automatically use Poppins-Medium for better readability.

## Auto-Loading
Fonts are automatically loaded when the app starts through the `utils/fonts.ts` utility and `app/_layout.tsx`.

## Benefits
- **Better readability** - Poppins is optimized for mobile screens
- **Professional look** - Clean, modern typography
- **Smaller app size** - Removed unused font variants
- **Consistent styling** - All text uses the same font family
