
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
    latex = latex.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1/$2)');

    // Recursive replacement for nested fractions
    changed = true;
    while (changed) {
        changed = false;
        latex = latex.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, function(match, p1, p2) {
            changed = true;
            return '(' + latexToString(p1) + '/' + latexToString(p2) + ')';
        });
    }

    // Replace constants
    latex = latex.replace(/\\pi/g, 'pi'); // Replace pi
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

    return latex;
}

const updateUtilities = () => {
    for (const element of document.getElementById("utilities").children) {
        let elementVal = element.innerHTML

        element.onclick = function () {
            answerMathField.write(elementVal)
        }

        MQ.StaticMath(element)
    }
}

const eq_type_btns = (eq_type) => {
    for (const eq_element of document.getElementById("eq-list").children) {
        eq_element.classList.remove("eq-active")
    }

    eq_type.classList.add("eq-active")

    let utils = document.getElementById("utilities")
    utils.innerHTML = ""

    for (let i = 0; i < EqTabs[eq_type.getAttribute("val")].length; i++) {
        utils.innerHTML += `<div class="eq-btn">${EqTabs[eq_type.getAttribute("val")][i]}</div>`
    }

    updateUtilities()
}