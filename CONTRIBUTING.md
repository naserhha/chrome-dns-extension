# 🤝 مشارکت در توسعه | Contributing | المساهمة | 贡献

این سند راهنمای مشارکت در توسعه افزونه DNS کروم است. لطفاً قبل از ارسال تغییرات، این راهنما را مطالعه کنید.

---

## 🇮🇷 فارسی

### چگونه مشارکت کنیم؟
- باگ‌ها را در Issues گزارش کنید.
- ویژگی‌های جدید را پیشنهاد دهید.
- کد خود را با رعایت استانداردها ارسال کنید.

### گزارش باگ
1. عنوان و توضیح کامل
2. مراحل بازتولید
3. نسخه مرورگر و سیستم عامل
4. اسکرین‌شات یا خطاها

### پیشنهاد ویژگی
1. توضیح کامل ویژگی
2. کاربرد و مزیت
3. ایده پیاده‌سازی

### مشارکت کد
1. Fork و Clone پروژه
2. شاخه جدید بسازید
3. تغییرات را اعمال و تست کنید
4. Pull Request با توضیح کامل ارسال کنید

### قوانین کدنویسی
- استفاده از ES6+ و async/await
- نام‌گذاری معنادار
- کامنت‌گذاری برای منطق پیچیده
- رعایت دسترس‌پذیری و ریسپانسیو بودن

### تماس
- Issue باز کنید یا به info@mohammadnasser.com ایمیل بزنید

### 🔒 امنیت و حریم خصوصی
- تمام دسترسی‌ها محدود به نیازهای ضروری است
- هیچ داده‌ای جمع‌آوری یا ارسال نمی‌شود
- کد منبع باز و قابل بررسی است
- برای جزئیات بیشتر فایل SECURITY.md را مطالعه کنید

---

## 🇺🇸 English

### How to Contribute
- Report bugs in Issues
- Suggest new features
- Submit code following standards

### Bug Reports
1. Clear title and description
2. Steps to reproduce
3. Browser and OS version
4. Screenshots or errors

### Feature Suggestions
1. Full feature description
2. Use case and benefit
3. Implementation idea

### Code Contribution
1. Fork and clone the repo
2. Create a new branch
3. Make and test changes
4. Submit a Pull Request with details

### Coding Standards
- Use ES6+ and async/await
- Meaningful naming
- Comment complex logic
- Ensure accessibility and responsiveness

### Contact
- Open an Issue or email info@mohammadnasser.com

### 🔒 Security & Privacy
- All permissions limited to essential needs
- No data is collected or transmitted
- Open source code and verifiable
- See SECURITY.md for more details

---

## 🇸🇦 العربية

### كيفية المساهمة
- أبلغ عن الأخطاء في Issues
- اقترح ميزات جديدة
- أرسل الكود وفقًا للمعايير

### تقارير الأخطاء
1. عنوان ووصف واضح
2. خطوات إعادة الإنتاج
3. إصدار المتصفح ونظام التشغيل
4. لقطات شاشة أو أخطاء

### اقتراح الميزات
1. وصف كامل للميزة
2. الاستخدام والفائدة
3. فكرة التنفيذ

### المساهمة بالكود
1. Fork و Clone للمستودع
2. أنشئ فرعًا جديدًا
3. أجرِ التغييرات واختبرها
4. أرسل Pull Request مع التفاصيل

### معايير الكود
- استخدم ES6+ و async/await
- أسماء ذات معنى
- علق المنطق المعقد
- تأكد من سهولة الوصول والاستجابة

### التواصل
- افتح Issue أو راسل info@mohammadnasser.com

### �� الأمان والخصوصية
- جميع الأذونات محدودة بالاحتياجات الضرورية
- لا يتم جمع أو إرسال أي بيانات
- كود مفتوح المصدر وقابل للتحقق
- راجع SECURITY.md للمزيد من التفاصيل

---

## 🇨🇳 中文

### 如何贡献
- 在 Issues 中报告错误
- 建议新功能
- 按标准提交代码

### 错误报告
1. 清晰的标题和描述
2. 重现步骤
3. 浏览器和操作系统版本
4. 截图或错误信息

### 功能建议
1. 完整的功能描述
2. 用例和好处
3. 实现思路

### 代码贡献
1. Fork 并克隆仓库
2. 创建新分支
3. 修改并测试
4. 提交详细 Pull Request

### 代码规范
- 使用 ES6+ 和 async/await
- 有意义的命名
- 注释复杂逻辑
- 保证可访问性和响应式

### 联系方式
- 提 Issue 或发送邮件至 info@mohammadnasser.com

### 🔒 安全和隐私
- 所有权限仅限于基本需求
- 不收集或传输任何数据
- 开源代码且可验证
- 查看 SECURITY.md 了解更多详情

## 🤝 How to Contribute

### Reporting Bugs

1. **Check existing issues**: Before creating a new issue, search the existing issues to see if your bug has already been reported.

2. **Create a detailed bug report**: When reporting a bug, please include:
   - A clear and descriptive title
   - Steps to reproduce the issue
   - Expected behavior vs actual behavior
   - Browser version and OS information
   - Screenshots if applicable
   - Console errors if any

### Suggesting Features

1. **Check existing feature requests**: Search existing issues to see if your feature has already been suggested.

2. **Create a feature request**: When suggesting a feature, please include:
   - A clear description of the feature
   - Use cases and benefits
   - Mockups or examples if applicable
   - Implementation suggestions if you have any

### Code Contributions

#### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/chrome-dns-extension.git
   cd chrome-dns-extension
   ```

2. **Install dependencies** (if any)
   ```bash
   npm install
   ```

3. **Load the extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the extension folder

4. **Make your changes**
   - Create a new branch for your feature/fix
   - Make your changes
   - Test thoroughly in Chrome

5. **Submit a pull request**
   - Push your changes to your fork
   - Create a pull request with a clear description

#### Code Style Guidelines

- **JavaScript**: Use ES6+ features, prefer `const` and `let` over `var`
- **CSS**: Use modern CSS features, maintain responsive design
- **HTML**: Use semantic HTML, ensure accessibility
- **Comments**: Add comments for complex logic
- **Error Handling**: Include proper error handling and user feedback

#### Testing

Before submitting a pull request, please ensure:

- [ ] The extension loads without errors
- [ ] All existing functionality works correctly
- [ ] New features are tested thoroughly
- [ ] UI is responsive and accessible
- [ ] No console errors in the browser

### Pull Request Guidelines

1. **Create a descriptive title**: Use a clear, descriptive title for your PR
2. **Provide a detailed description**: Explain what changes you made and why
3. **Include screenshots**: If your changes affect the UI, include screenshots
4. **Reference issues**: If your PR fixes an issue, reference it in the description
5. **Keep PRs focused**: Try to keep each PR focused on a single feature or fix

## 📋 Development Guidelines

### Project Structure

```
chrome-dns-extension/
├── manifest.json          # Extension manifest
├── popup.html            # Main popup interface
├── popup.css             # Styles for the popup
├── popup.js              # Popup functionality
├── background.js          # Background service worker
├── icons/                # Extension icons
├── README.md             # Project documentation
├── LICENSE               # MIT License
├── CHANGELOG.md          # Version history
├── CONTRIBUTING.md       # This file
└── package.json          # Project metadata
```

### Coding Standards

#### JavaScript
- Use modern ES6+ syntax
- Prefer async/await over callbacks
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Handle errors gracefully with try/catch

#### CSS
- Use CSS Grid and Flexbox for layouts
- Maintain responsive design principles
- Use CSS custom properties for theming
- Ensure good contrast ratios for accessibility
- Use meaningful class names

#### HTML
- Use semantic HTML elements
- Ensure proper ARIA attributes for accessibility
- Keep markup clean and well-structured
- Validate HTML for errors

### Security Considerations

- Never store sensitive information in localStorage
- Validate all user inputs
- Use HTTPS for any external requests
- Follow Chrome extension security best practices
- Minimize required permissions

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Environment details**:
   - Chrome version
   - Operating system
   - Extension version

2. **Steps to reproduce**:
   - Clear, step-by-step instructions
   - Expected vs actual behavior

3. **Additional information**:
   - Console errors (if any)
   - Screenshots or screen recordings
   - Any relevant system information

## 💡 Feature Requests

When suggesting features, please include:

1. **Clear description**: What the feature should do
2. **Use cases**: How it would benefit users
3. **Implementation ideas**: If you have suggestions
4. **Mockups**: Visual examples if applicable

## 📝 Documentation

- Keep documentation up to date
- Add comments to complex code
- Update README.md for new features
- Include usage examples where appropriate

## 🏷️ Versioning

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR**: Incompatible API changes
- **MINOR**: New functionality in a backwards-compatible manner
- **PATCH**: Backwards-compatible bug fixes

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

## 🙏 Acknowledgments

Thank you to all contributors who help improve this project!

## 📞 Contact

If you have questions about contributing:

- Open an issue on GitHub
- Contact the author: Mohammad Nasser Haji Hashemabad
  - LinkedIn: [@nasserhaji](https://ir.linkedin.com/in/nasserhaji)
  - GitHub: [@nasserhaji](https://github.com/nasserhaji)
  - Website: [mohammadnasser.com](https://mohammadnasser.com/)

---

**Thank you for contributing to DNS Configuration Manager!** 🌟 