const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/omkar/OneDrive/Desktop/New folder/career-platform/src/pages/Auth/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('RegisterForm.tsx'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf-8');

    // 1. Label asterisks
    content = content.replace(/<label className="text-sm font-medium text-gray-700">([^<]+)<\/label>/g, 
        '<label className="text-sm font-medium text-gray-700">$1 <span className="text-red-500 ml-0.5">*</span></label>'
    );

    // 2. Input required
    content = content.replace(/<input\s+([^>]+)>/g, (match, inner) => {
        // Skip checkboxes
        if (inner.includes('type="checkbox"') || inner.includes('type="radio"')) return match;
        // Skip already required
        if (inner.includes('required')) return match;
        
        // Remove trailing slash if present to cleanly append 'required />'
        const isSelfClosing = inner.trim().endsWith('/');
        let clearInner = isSelfClosing ? inner.slice(0, -1).trim() : inner;
        
        return `<input ${clearInner} required ${isSelfClosing ? '/>' : '>'}`;
    });

    // 3. Select required
    content = content.replace(/<Select>/g, '<Select required>');

    // 4. DatePicker required
    content = content.replace(/<DatePicker/g, '<DatePicker required');
    // Avoid doubling if it was already there
    content = content.replace(/required\s+required/g, 'required');

    fs.writeFileSync(path.join(dir, file), content, 'utf-8');
    console.log(`Updated ${file}`);
});
