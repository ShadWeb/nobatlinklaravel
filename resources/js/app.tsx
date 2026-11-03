import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import '../css/app.css';

createInertiaApp({
    resolve: name => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({ el, App, props }) {
        import('react-dom/client').then(({ createRoot }) => {
            const root = createRoot(el);
            root.render(<App {...props} />);
        });
    },
    progress: { color: '#4B5563' },
});
