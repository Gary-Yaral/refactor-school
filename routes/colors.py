from flask import render_template

colorsData = {
    "purple": "/purple.html",
    "green": "/green.html",
    "orange": "/orange.html"
}

# Selects one template to show
def setTemplate(color):
    return render_template(colorsData[color])