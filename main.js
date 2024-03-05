let latex_timeout = 100 // Force timeout the latex string is iterated
let counter = 0
const EqTabs = {
    Basic: [
        "a+b",
        "a-b",
        "a * b",
        "a\\div b",
        "\\frac{a}{b}",
        "|a|"
    ],
    Exponents: [
        "a^b",
        "\\sqrt{a}",
        "\\sqrt[n]{x}",
        "e^a"
    ],
    Trigonometry: [
        "sin(a)",
        "cos(a)",
        "tan(a)",
        "csc(a)",
        "sec(a)",
        "cot(a)"
    ],
    InverseTrigonometry: [
        "\\sin^{-1}(a)",
        "\\cos^{-1}(a)",
        "\\tan^{-1}(a)",
        "\\cot^{-1}(a)",
        "\\sec^{-1}(a)",
        "\\csc^{-1}(a)",
    ],
    Logarithms: [
        "\\log(a)",
        "\\log_a{b}",
        "ln(a)",
        "e^x"
    ],
    Intervals: [
        "[a,b]",
        "(a,b]",
        "[a,b)",
        "(a,b)",
        "{A}\\cup{B}"
    ],
    Others: [
        "\\infty",
        "\\pi",
        "e",
        "(a)",
        "[a]",
        "{a}"
    ],
}

const KeyboardLayout = [
    {
        label: "Basic",
        tooltip: "Only the essential",
        rows: [
            [
                "+", "-", "\\times", "\\frac{{#@}}{{#?}}", "=", ".",
                "(", ")", "\\sqrt{#0}", "#@^{#?}",
                "\\log(#0)", "\\log_#@{#?}", "ln(#@)", "e^x"
            ],
            ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
        ]
    },
    "alphabetic",
    {
        label: "Interval",
        tooltip: "Interval notations",
        rows: [
            [
                "[#@,#?]", "(#@,#?]", "[#@,#?)",
                "(#@,#?)", "{#@}\\cup{#?}"
            ],
        ]
    },
    {
        label: "Trig",
        tooltip: "Trigonometric functions",
        rows: [
            [
                "\\sin(#@)",
                "\\cos(#@)",
                "\\tan(#@)",
                "\\sin^{-1}(#@)",
                "\\cos^{-1}(#@)",
                "\\tan^{-1}(#@)",
            ],
            [
                "\\csc(#@)",
                "\\sec(#@)",
                "\\cot(#@)",
                "\\csc^{-1}(#@)",
                "\\sec^{-1}(#@)",
                "\\cot^{-1}(#@)",
            ],
        ]
    },
    {
        label: "Symbols",
        tooltip: "Greek symbols",
        rows: [
            [
                "\\pi",
                "\\theta",
                "\\phi",
                "\\infty",
            ]
        ]
    },

];

function isLatex(input) {
    // Regular expressions to detect common LaTeX commands
    const latexPatterns = [
        /\\[a-zA-Z]+\{.*?\}/, // Command with arguments in curly braces, e.g., \frac{1}{2}
        /\\[a-zA-Z]+\s*\[\d+\]/, // Command with optional argument in square brackets, e.g., \sqrt[3]{x}
        /\\[a-zA-Z]+/, // Command without arguments, e.g., \sin, \cos
        /\\[a-zA-Z]+\^\{.*?\}/ // Command with exponent, e.g., x^{2}
    ];

    // Check if the input string matches any LaTeX patterns
    for (const pattern of latexPatterns) {
        if (pattern.test(input)) {
            return true;
        }
    }

    return false;
}

function latexToString(latex) {
    // Remove \left and \right commands
    latex = latex.replaceAll("\\left", "").replaceAll("\\right","");

    // Replace \div with /
    latex = latex.replace(/\\div /g, '/');
    latex = latex.replace(/\\div/g, '/');

    // Replace inverse trigonometric functions with asin, acos, atan, asec, acsc, and acot
    latex = latex.replace(/\\sin\^\{(-?\d+)\}\((.+?)\)/g, function(match, p1, p2) {
        return parseInt(p1) < -1 ? 'asin(' + latexToString(p2) + ')^(' + p1 + ')' : 'asin(' + latexToString(p2) + ')';
    });
    latex = latex.replace(/\\cos\^\{(-?\d+)\}\((.+?)\)/g, function(match, p1, p2) {
        return parseInt(p1) < -1 ? 'acos(' + latexToString(p2) + ')^(' + p1 + ')' : 'acos(' + latexToString(p2) + ')';
    });
    latex = latex.replace(/\\tan\^\{(-?\d+)\}\((.+?)\)/g, function(match, p1, p2) {
        return parseInt(p1) < -1 ? 'atan(' + latexToString(p2) + ')^(' + p1 + ')' : 'atan(' + latexToString(p2) + ')';
    });
    latex = latex.replace(/\\csc\^\{(-?\d+)\}\((.+?)\)/g, function(match, p1, p2) {
        return parseInt(p1) < -1 ? 'acsc(' + latexToString(p2) + ')^(' + p1 + ')' : 'acsc(' + latexToString(p2) + ')';
    });
    latex = latex.replace(/\\sec\^\{(-?\d+)\}\((.+?)\)/g, function(match, p1, p2) {
        return parseInt(p1) < -1 ? 'asec(' + latexToString(p2) + ')^(' + p1 + ')' : 'asec(' + latexToString(p2) + ')';
    });
    latex = latex.replace(/\\cot\^\{(-?\d+)\}\((.+?)\)/g, function(match, p1, p2) {
        return parseInt(p1) < -1 ? 'acot(' + latexToString(p2) + ')^(' + p1 + ')' : 'acot(' + latexToString(p2) + ')';
    });

    // Recursive replacement for nested inverse trigonometric functions
    let changed = true;
    while (changed) {
        changed = false;
        latex = latex.replace(/\\sin\^\{(-?\d+)\}\((.+?)\)/g, function(match, p1, p2) {
            changed = true;
            return parseInt(p1) < -1 ? 'asin(' + latexToString(p2) + ')^(' + p1 + ')' : 'asin(' + latexToString(p2) + ')';
        });
        latex = latex.replace(/\\cos\^\{(-?\d+)\}\((.+?)\)/g, function(match, p1, p2) {
            changed = true;
            return parseInt(p1) < -1 ? 'acos(' + latexToString(p2) + ')^(' + p1 + ')' : 'acos(' + latexToString(p2) + ')';
        });
        latex = latex.replace(/\\tan\^\{(-?\d+)\}\((.+?)\)/g, function(match, p1, p2) {
            changed = true;
            return parseInt(p1) < -1 ? 'atan(' + latexToString(p2) + ')^(' + p1 + ')' : 'atan(' + latexToString(p2) + ')';
        });
        latex = latex.replace(/\\csc\^\{(-?\d+)\}\((.+?)\)/g, function(match, p1, p2) {
            changed = true;
            return parseInt(p1) < -1 ? 'acsc(' + latexToString(p2) + ')^(' + p1 + ')' : 'acsc(' + latexToString(p2) + ')';
        });
        latex = latex.replace(/\\sec\^\{(-?\d+)\}\((.+?)\)/g, function(match, p1, p2) {
            changed = true;
            return parseInt(p1) < -1 ? 'asec(' + latexToString(p2) + ')^(' + p1 + ')' : 'asec(' + latexToString(p2) + ')';
        });
        latex = latex.replace(/\\cot\^\{(-?\d+)\}\((.+?)\)/g, function(match, p1, p2) {
            changed = true;
            return parseInt(p1) < -1 ? 'acot(' + latexToString(p2) + ')^(' + p1 + ')' : 'acot(' + latexToString(p2) + ')';
        });
    }

    // Replace trigonometric functions with exponents and nested trigonometric functions
    while (latex.includes("\\sin") || latex.includes("\\cos") || latex.includes("\\tan") || latex.includes("\\csc") || latex.includes("\\sec") || latex.includes("\\cot")) {
        latex = latex.replace(/\\sin\^\{(.+?)\}\((.+?)\)/g, 'sin^($1)($2)');
        latex = latex.replace(/\\cos\^\{(.+?)\}\((.+?)\)/g, 'cos^($1)($2)');
        latex = latex.replace(/\\tan\^\{(.+?)\}\((.+?)\)/g, 'tan^($1)($2)');
        latex = latex.replace(/\\csc\^\{(.+?)\}\((.+?)\)/g, 'csc^($1)($2)');
        latex = latex.replace(/\\sec\^\{(.+?)\}\((.+?)\)/g, 'sec^($1)($2)');
        latex = latex.replace(/\\cot\^\{(.+?)\}\((.+?)\)/g, 'cot^($1)($2)');
        latex = latex.replace(/\\sin\((.+?)\)/g, 'sin($1)');
        latex = latex.replace(/\\cos\((.+?)\)/g, 'cos($1)');
        latex = latex.replace(/\\tan\((.+?)\)/g, 'tan($1)');
        latex = latex.replace(/\\csc\((.+?)\)/g, 'csc($1)');
        latex = latex.replace(/\\sec\((.+?)\)/g, 'sec($1)');
        latex = latex.replace(/\\cot\((.+?)\)/g, 'cot($1)');
    }

    // Replace logarithms with exponents and nested logarithms
    while (latex.includes("\\log")) {
        latex = latex.replace(/\\log\^\{(.+?)\}\((.+?)\)/g, 'log^($1)($2)');
        latex = latex.replace(/\\log\((.+?)\)/g, 'log($1)');
    }

    // Replace natural logarithm
    latex = latex.replace(/\\ln/g, 'ln');

    // Replace exponential function
    latex = latex.replace(/\\exp/g, 'exp');

    // Replace infinity
    latex = latex.replace(/\\infty/g, 'inf');
    latex = latex.replace(/Infinity/g, 'inf');

    // Replace nth roots
    latex = latex.replace(/\\sqrt\[(.+?)\]\{([^{}]+)\}/g, '($2)^(1/$1)');

    // Replace fractions
    latex = latex.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1)/($2)');

    // Recursive replacement for nested fractions
    changed = true;
    while (changed) {
        changed = false;
        latex = latex.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, function(match, p1, p2) {
            changed = true;
            return '(' + latexToString(p1) + ')' + '/' + '(' + latexToString(p2) + ')';
        });
    }

    // Replace constants
    latex = latex.replace(/\\pi/g, 'pi'); // Replace pi
    latex = latex.replace(/\\phi/g, 'phi'); // Replace phi
    latex = latex.replace(/\\e/g, 'e'); // Replace e (requires \mathrm{} in LaTeX)

    // Recursive replacement for nested nth root and square root
    changed = true;
    while (changed) {
        changed = false;
        latex = latex.replace(/\\sqrt\{([^{}]+)\}/g, function(match, p1) {
            changed = true;
            return '(' + p1 + ')^(1/2)';
        });
        latex = latex.replace(/\\sqrt\[([^()])\]\{([^{}]+)\}/g, function(match, p1, p2) {
            changed = true;
            return '(' + latexToString(p2) + ')^(1/' + p1 + ')';
        });
    }

    // Replace escaped characters
    latex = latex.replace(/\\{/g, '{'); // Remove escaped opening brace
    latex = latex.replace(/\\}/g, '}'); // Remove escaped closing brace

    if (isLatex(latex) && counter <= latex_timeout) {
        return latexToString(latex)
    }
    else {
        counter = 0
        return latex
    }
}

const onload = () => {
    import("//unpkg.com/mathlive?module").then((mathlive) => {
        mathlive.renderMathInDocument()

        const mf = document.getElementById("formula");

        mf.menuItems = [
            {
                label: 'Copy',
                onMenuSelect: () => {
                    if (mf.value === "") return
                    navigator.clipboard.writeText(latexToString(mf.value))
                }
            },
        ];

        // Copy as text
        document.getElementById("copy_eq").onclick = () => {
            if (mf.value === "") return
            navigator.clipboard.writeText(latexToString(mf.value))
        }

        mathVirtualKeyboard.layouts = KeyboardLayout
        mathVirtualKeyboard.show()
        mf.mathVirtualKeyboardPolicy = "manual";
        mf.addEventListener("focusin", () =>  mathVirtualKeyboard.show());
    })
}