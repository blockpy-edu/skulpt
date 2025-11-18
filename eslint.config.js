import globals from "globals";
import eslintPluginJs from "@eslint/js";
import prettierConfig from "eslint-config-prettier";

export default [
    // Apply ESLint recommended rules
    eslintPluginJs.configs.recommended,

    // Disable stylistic rules conflicting with Prettier
    prettierConfig,
    {
        // Base environment & parser settings
        languageOptions: {
            ecmaVersion: 2019,
            sourceType: "module",
            globals: {
                window: "writable",
                document: "writable",
                console: "writable",
                Sk: "writable",
                JSBI: "readonly",
                ...globals.browser
            }
        },
        ignores: [
            "node_modules",
            "dist",
            "build",
            "coverage",
            "out",
            "gen",
            "node_modules_old",
        ],
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
        rules: {
            "no-mixed-spaces-and-tabs": "error",
            curly: ["error", "all"],
            "brace-style": ["error", "1tbs", { allowSingleLine: true }],
            "no-unused-vars": "warn",
            "no-undef": "warn",
            "no-self-assign": "warn",
            "no-empty": "warn",
        },
    },
];
