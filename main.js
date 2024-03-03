let CurrentOperationTab = ""


const patterns = [
    [/\\sqrt\[(.)\]{(.)}/g, "({2}^(1/{1}))", "\\sqrt[1]{2}"], // nth root
    [/\\sqrt{(.)}/g, "(sqrt({1}))","\\sqrt{1}"], // sqrt root
    [/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "({1}/{2})", "\\frac{1}{2}"], // fractions

    [/\\sin\^\{(-?\d+)\}\(([^()]+)\)/g, "(sin^({1})({2}))", "\\sin^{1}(2)"], // arcsin
    [/\\cos\^\{(-?\d+)\}\(([^()]+)\)/g, "(cos^({1})({2}))", "\\cos^{1}(2)"], // arccos
    [/\\tan\^\{(-?\d+)\}\(([^()]+)\)/g, "(tan^({1})({2}))", "\\tan^{1}(2)"], // arctan
    [/\\sec\^\{(-?\d+)\}\(([^()]+)\)/g, "(sec^({1})({2}))", "\\sec^{1}(2)"], // arcsec
    [/\\csc\^\{(-?\d+)\}\(([^()]+)\)/g, "(csc^({1})({2}))", "\\csc^{1}(2)"], // arccsc
    [/\\cot\^\{(-?\d+)\}\(([^()]+)\)/g, "(cot^({1})({2}))", "\\cot^{1}(2)"], // arccot

    [/\\sin\(([^()]+)\)/g, "(sin({1}))", "\\sin(1)"], // sin
    [/\\cos\((.+)\)/g, "(cos({1}))", "\\cos(1)"], // cos
    [/\\tan\((.+)\)/g, "(tan({1}))", "\\tan(1)"], // tan
    [/\\sec\((.+)\)/g, "(sec({1}))", "\\sec(1)"], // sec
    [/\\csc\((.+)\)/g, "(csc({1}))", "\\csc(1)"], // csc
    [/\\cot\((.+)\)/g, "(cot({1}))", "\\cot(1)"], // cot

    [/.?\^([^()]+)/g], // exponents
]
//\left(\sin ^{-1}(x)\right)\left(\frac{1}{2}\left(2\sin ^{-1}(x)+\sin \left(2\sin ^{-1}(x)\right)\right)\right)-\left(\frac{1}{4}\sin ^{-2}\left(x\right)+\frac{1}{8}\cos \left(2\right)\right)

function latexToString(latex) {
    // Remove \left and \right commands
    latex = latex.replaceAll("\\left", "").replaceAll("\\right","");

    // Replace inverse trigonometric functions with asin, acos, atan, asec, acsc, and acot
    latex = latex.replace(/\\sin\^\{(-?\d+)\}\((.+?)\)/g, function(match, p1, p2) {
        return parseInt(p1) === -1 ? 'asin(' + latexToString(p2) + ')' : parseInt(p1) < -1 ? 'asin(' + latexToString(p2) + ')^(' + Math.abs(p1) + ')' : 'asin(' + latexToString(p2) + ')';
    });
    latex = latex.replace(/\\cos\^\{(-?\d+)\}\((.+?)\)/g, function(match, p1, p2) {
        return parseInt(p1) === -1 ? 'acos(' + latexToString(p2) + ')' : parseInt(p1) < -1 ? 'acos(' + latexToString(p2) + ')^(' + Math.abs(p1) + ')' : 'acos(' + latexToString(p2) + ')';
    });
    latex = latex.replace(/\\tan\^\{(-?\d+)\}\((.+?)\)/g, function(match, p1, p2) {
        return parseInt(p1) === -1 ? 'atan(' + latexToString(p2) + ')' : parseInt(p1) < -1 ? 'atan(' + latexToString(p2) + ')^(' + Math.abs(p1) + ')' : 'atan(' + latexToString(p2) + ')';
    });
    latex = latex.replace(/\\csc\^\{(-?\d+)\}\((.+?)\)/g, function(match, p1, p2) {
        return parseInt(p1) === -1 ? 'acsc(' + latexToString(p2) + ')' : parseInt(p1) < -1 ? 'acsc(' + latexToString(p2) + ')^(' + Math.abs(p1) + ')' : 'acsc(' + latexToString(p2) + ')';
    });
    latex = latex.replace(/\\sec\^\{(-?\d+)\}\((.+?)\)/g, function(match, p1, p2) {
        return parseInt(p1) === -1 ? 'asec(' + latexToString(p2) + ')' : parseInt(p1) < -1 ? 'asec(' + latexToString(p2) + ')^(' + Math.abs(p1) + ')' : 'asec(' + latexToString(p2) + ')';
    });
    latex = latex.replace(/\\cot\^\{(-?\d+)\}\((.+?)\)/g, function(match, p1, p2) {
        return parseInt(p1) === -1 ? 'acot(' + latexToString(p2) + ')' : parseInt(p1) < -1 ? 'acot(' + latexToString(p2) + ')^(' + Math.abs(p1) + ')' : 'acot(' + latexToString(p2) + ')';
    });

    // Recursive replacement for nested inverse trigonometric functions
    let changed = true;
    while (changed) {
        changed = false;
        latex = latex.replace(/\\sin\^\{(-?\d+)\}\((.+?)\)/g, function(match, p1, p2) {
            changed = true;
            return parseInt(p1) === -1 ? 'asin(' + latexToString(p2) + ')' : parseInt(p1) < -1 ? 'asin(' + latexToString(p2) + ')^(' + Math.abs(p1) + ')' : 'asin(' + latexToString(p2) + ')';
        });
        latex = latex.replace(/\\cos\^\{(-?\d+)\}\((.+?)\)/g, function(match, p1, p2) {
            changed = true;
            return parseInt(p1) === -1 ? 'acos(' + latexToString(p2) + ')' : parseInt(p1) < -1 ? 'acos(' + latexToString(p2) + ')^(' + Math.abs(p1) + ')' : 'acos(' + latexToString(p2) + ')';
        });
        latex = latex.replace(/\\tan\^\{(-?\d+)\}\((.+?)\)/g, function(match, p1, p2) {
            changed = true;
            return parseInt(p1) === -1 ? 'atan(' + latexToString(p2) + ')' : parseInt(p1) < -1 ? 'atan(' + latexToString(p2) + ')^(' + Math.abs(p1) + ')' : 'atan(' + latexToString(p2) + ')';
        });
        latex = latex.replace(/\\csc\^\{(-?\d+)\}\((.+?)\)/g, function(match, p1, p2) {
            changed = true;
            return parseInt(p1) === -1 ? 'acsc(' + latexToString(p2) + ')' : parseInt(p1) < -1 ? 'acsc(' + latexToString(p2) + ')^(' + Math.abs(p1) + ')' : 'acsc(' + latexToString(p2) + ')';
        });
        latex = latex.replace(/\\sec\^\{(-?\d+)\}\((.+?)\)/g, function(match, p1, p2) {
            changed = true;
            return parseInt(p1) === -1 ? 'asec(' + latexToString(p2) + ')' : parseInt(p1) < -1 ? 'asec(' + latexToString(p2) + ')^(' + Math.abs(p1) + ')' : 'asec(' + latexToString(p2) + ')';
        });
        latex = latex.replace(/\\cot\^\{(-?\d+)\}\((.+?)\)/g, function(match, p1, p2) {
            changed = true;
            return parseInt(p1) === -1 ? 'acot(' + latexToString(p2) + ')' : parseInt(p1) < -1 ? 'acot(' + latexToString(p2) + ')^(' + Math.abs(p1) + ')' : 'acot(' + latexToString(p2) + ')';
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
            return '(' + latexToString(p1) + ')/(' + latexToString(p2) + ')';
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

const WebWorkParser = (LaTex) => {

    let newParsedSr = LaTex

    patterns.forEach((pattern, index) => {
        let regEx = pattern[0]

        let allMatches = [...newParsedSr.matchAll(regEx)]

        allMatches.forEach((val, i) => {
            if (!pattern[1]) return

            val.forEach((t, i) => {
                if (i === 0) return

                let main_replace = pattern[2]
                let elementParsedString = pattern[1]

                elementParsedString = elementParsedString.replaceAll(`{${i}}`, t)
                main_replace = main_replace.replaceAll(`${i}`, t)

                newParsedSr = newParsedSr.replaceAll(main_replace, elementParsedString)
            })
        })
    })

    console.log(latexToString(LaTex))
}

// Operation Drop Down Menu (Credits https://www.w3schools.com/howto/howto_custom_select.asp)

var x, i, j, l, ll, selElmnt, a, b, c;
/*look for any elements with the class "custom-select":*/
x = document.getElementsByClassName("custom-select");
l = x.length;
for (i = 0; i < l; i++) {
    selElmnt = x[i].getElementsByTagName("select")[0];
    ll = selElmnt.length;
    /*for each element, create a new DIV that will act as the selected item:*/
    a = document.createElement("DIV");
    a.setAttribute("class", "select-selected");
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    /*for each element, create a new DIV that will contain the option list:*/
    b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");
    for (j = 1; j < ll; j++) {
        /*for each option in the original select element,
        create a new DIV that will act as an option item:*/
        c = document.createElement("DIV");
        c.innerHTML = selElmnt.options[j].innerHTML;
        c.addEventListener("click", function(e) {
            /*when an item is clicked, update the original select box,
            and the selected item:*/
            var y, i, k, s, h, sl, yl;
            s = this.parentNode.parentNode.getElementsByTagName("select")[0];
            sl = s.length;
            h = this.parentNode.previousSibling;
            for (i = 0; i < sl; i++) {
                if (s.options[i].innerHTML == this.innerHTML) {
                    s.selectedIndex = i;
                    h.innerHTML = this.innerHTML;
                    y = this.parentNode.getElementsByClassName("same-as-selected");
                    yl = y.length;
                    for (k = 0; k < yl; k++) {
                        y[k].removeAttribute("class");
                    }
                    this.setAttribute("class", "same-as-selected");
                    break;
                }
            }
            h.click();
        });
        b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener("click", function(e) {
        /*when the select box is clicked, close any other select boxes,
        and open/close the current select box:*/
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
    });
}
function closeAllSelect(elmnt) {
    /*a function that will close all select boxes in the document,
    except the current select box:*/
    var x, y, i, xl, yl, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    xl = x.length;
    yl = y.length;
    for (i = 0; i < yl; i++) {
        if (elmnt == y[i]) {
            arrNo.push(i)
        } else {
            y[i].classList.remove("select-arrow-active");
        }
    }
    for (i = 0; i < xl; i++) {
        if (arrNo.indexOf(i)) {
            x[i].classList.add("select-hide");
        }
    }
}
/*if the user clicks anywhere outside the select box,
then close all select boxes:*/
document.addEventListener("click", closeAllSelect);