import { describe, it, expect, vi, beforeEach } from 'vitest';
import { util } from '../common/util';

describe('util module', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        vi.restoreAllMocks();
    });

    it('escapes HTML special characters safely', () => {
        expect(util.escapeHtml('<script>alert("xss" & \'test\')</script>')).toBe(
            '&lt;script&gt;alert(&quot;xss&quot; &amp; &#039;test&#039;)&lt;/script&gt;',
        );
        expect(util.escapeHtml(null)).toBe('');
    });

    it('encodes and decodes UTF-8 strings via base64', () => {
        const original = 'Happy Wedding Ahmed & Nermin 🎉 بارك الله لكما';
        const encoded = util.base64Encode(original);
        expect(encoded).not.toBe(original);
        expect(util.base64Decode(encoded)).toBe(original);
    });

    it('converts WhatsApp-style markdown to HTML', () => {
        const raw = 'Hello *bold* and _italic_ and ~strike~ and ```code```!';
        const html = util.convertMarkdownToHTML(raw);
        expect(html).toContain('<strong class="text-theme-auto">bold</strong>');
        expect(html).toContain('<em class="text-theme-auto">italic</em>');
        expect(html).toContain('<del class="text-theme-auto">strike</del>');
        expect(html).toContain('<code class="font-monospace text-theme-auto">code</code>');
    });

    it('parses user-agent strings accurately', () => {
        const winChrome =
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
        expect(util.parseUserAgent(winChrome)).toBe('Chrome Desktop Windows 10.0');

        const androidMobile =
            'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36';
        expect(util.parseUserAgent(androidMobile)).toBe('Chrome Mobile Android 14');

        expect(util.parseUserAgent('')).toBe('Unknown');
    });

    it('calculates GMT offset for valid timezones', () => {
        expect(util.getGMTOffset('UTC')).toBe('GMT+0');
        expect(util.getGMTOffset('Asia/Jakarta')).toBe('GMT+7');
    });

    it('disables and restores buttons and checkboxes', () => {
        const btn = document.createElement('button');
        btn.innerHTML = 'Send';
        document.body.appendChild(btn);

        const handle = util.disableButton(btn, 'Saving');
        expect(btn.disabled).toBe(true);
        expect(btn.innerHTML).toContain('Saving');

        handle.restore(false);
        expect(btn.disabled).toBe(false);
        expect(btn.innerHTML).toBe('Send');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'chk-test';
        const label = document.createElement('label');
        label.htmlFor = 'chk-test';
        label.innerHTML = 'Filter';
        document.body.append(checkbox, label);

        const chkHandle = util.disableCheckbox(checkbox);
        expect(checkbox.disabled).toBe(true);
        expect(label.innerHTML).toContain('spinner-border');

        chkHandle.restore();
        expect(checkbox.disabled).toBe(false);
        expect(label.innerHTML).toBe('Filter');
    });

    it('triggers notify and ask dialogs with appropriate prefixes', () => {
        const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
        const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

        util.notify('Saved').success();
        expect(alertSpy).toHaveBeenCalledWith('🟩 Saved');

        util.notify('Failed').error();
        expect(alertSpy).toHaveBeenCalledWith('🟥 Failed');

        expect(util.ask('Proceed?')).toBe(true);
        expect(confirmSpy).toHaveBeenCalledWith('🟦 Proceed?');
    });
});
