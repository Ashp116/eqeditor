const onload = () => {
    import("//unpkg.com/mathlive?module").then((mathlive) => {
        mathlive.renderMathInDocument()

        const mf = document.getElementById("formula");

        mf.menuItems = [
            {
                label: 'Copy as Text',
                onMenuSelect: () => {
                    if (mf.value === "") return
                    navigator.clipboard.writeText(mf.getValue("ascii-math"))
                }
            },
            {
                label: 'Copy as LaTex',
                onMenuSelect: () => {
                    if (mf.value === "") return
                    navigator.clipboard.writeText(mf.value)
                }
            },
        ];

        // Copy as text
        document.getElementById("copy_eq").onclick = () => {
            if (mf.value === "") return
            navigator.clipboard.writeText((mf.getValue("ascii-math")))
        }

        mathVirtualKeyboard.layouts = KeyboardLayout
        mathVirtualKeyboard.show()
        mf.mathVirtualKeyboardPolicy = "manual";
        mf.addEventListener("focusin", () =>  mathVirtualKeyboard.show());
    })
}