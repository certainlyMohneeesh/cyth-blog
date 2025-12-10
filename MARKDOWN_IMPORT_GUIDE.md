# Markdown Import Feature - Quick Start Guide

## 🎯 How to Use the Markdown Importer

### Step 1: Open Your Post
1. Go to Sanity Studio (`http://localhost:3000/studio`)
2. Navigate to your Posts
3. Open an existing post or create a new one

### Step 2: Find the Import Button
Look for the **"Import Markdown"** button (📝 icon) in the document toolbar at the top of the editor, next to Publish/Unpublish buttons.

### Step 3: Paste Your Markdown
1. Click "Import Markdown"
2. A dialog will open with a text area
3. Paste your markdown content
4. Click "Import Markdown" button at the bottom

### Step 4: Preview & Publish
The markdown will be converted to Sanity blocks and **appended** to your existing content. You can now:
- Edit individual blocks
- Rearrange them
- Preview how they render
- Publish when ready

---

## 📝 Test Markdown Example

Copy and paste this into the markdown importer to test all features:

```markdown
# Complete Feature Test

## Text Formatting

This paragraph has **bold text**, *italic text*, `inline code`, and ~~strikethrough~~.

You can also combine them: **_bold and italic_** or `**bold code**`.

### Links

Check out [OpenAI](https://openai.com) and [Google](https://google.com).

## Code Blocks

Here's a JavaScript example:

\```javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55
\```

Python example:

\```python
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

print(quicksort([3,6,8,10,1,2,1]))
\```

## Tables

### Framework Comparison

| Framework | Language | Learning Curve | Performance |
|-----------|----------|----------------|-------------|
| React | JavaScript | Medium | Excellent |
| Vue | JavaScript | Easy | Excellent |
| Angular | TypeScript | Hard | Very Good |
| Svelte | JavaScript | Easy | Outstanding |

### Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| CSS Grid | ✅ | ✅ | ✅ | ✅ |
| Flexbox | ✅ | ✅ | ✅ | ✅ |
| WebGL | ✅ | ✅ | ✅ | ✅ |

## Lists

### Unordered List

- First item
- Second item
- Third item with **bold**
- Fourth item with *italic*

### Ordered List

1. Step one: Install dependencies
2. Step two: Configure settings
3. Step three: Run the application
4. Step four: Deploy to production

## Blockquotes

> "The best way to predict the future is to invent it."
> — Alan Kay

> **Important**: Always test your code before deploying to production!

## Nested Content

### Headers at Different Levels

#### H4 Header
This is content under H4.

### Another H3
More content here.

## Combined Example

Here's how to use the fetch API:

\```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

async function fetchUser(id: number): Promise<User> {
  const response = await fetch(\`https://api.example.com/users/\${id}\`);
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }
  return await response.json();
}

try {
  const user = await fetchUser(1);
  console.log(user);
} catch (error) {
  console.error('Failed to fetch user:', error);
}
\```

### API Response Format

| Field | Type | Description |
|-------|------|-------------|
| id | number | Unique identifier |
| name | string | User's full name |
| email | string | Contact email |
| created_at | string | ISO timestamp |

---

## End of Test

If all of the above converts correctly, you're all set! 🎉
```

---

## 🛠️ Troubleshooting

### Button Not Showing
- Make sure you're editing a **Post** document (not Settings or Author)
- Refresh the Studio page
- Check browser console for errors

### Conversion Issues
- Ensure proper markdown syntax (spaces after # for headers)
- Code blocks need proper closing backticks
- Tables need separator line with dashes (---|---|)
- Links need format: [text](url)

### Content Not Appearing
- Check that the import completed (dialog should close)
- Scroll down in the content editor - new blocks are appended at the bottom
- Try refreshing the page

---

## 💡 Pro Tips

1. **Clean Your Markdown First**: Remove any HTML tags or special formatting before importing
2. **Test Small Sections**: Import and test small pieces of content first
3. **Edit After Import**: You can edit, rearrange, or delete imported blocks
4. **Use Preview**: Always preview before publishing to see how it renders
5. **Save Frequently**: Save your work after importing large documents

---

## 🚀 Best Practices

### For Code Blocks
- Always specify the language for proper syntax highlighting
- Use descriptive variable names in examples
- Add comments for complex logic

### For Tables
- Keep tables simple (max 5-6 columns)
- Use clear, concise headers
- Align data logically

### For Headers
- Use H2 for main sections
- Use H3 for subsections
- Use H4 for sub-subsections
- Don't skip levels (don't go from H2 to H4)

---

## 📚 Additional Resources

- [Markdown Guide](https://www.markdownguide.org/)
- [Sanity Portable Text](https://www.sanity.io/docs/block-content)
- [Code Block Languages](https://prismjs.com/#supported-languages)

Happy blogging! ✨
