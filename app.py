from pathlib import Path
import plotly.graph_objects as go
import numpy as np
import streamlit as st
from PIL import Image
import random

import base64

# --- PATH SETTINGS ---
current_dir = Path(__file__).parent if "__file__" in locals() else Path.cwd()
css_file = current_dir / "styles" / "main.css"
resume_file = current_dir / "assets" / "Resume_AgamArora.pdf"
profile_pic = current_dir / "assets" / "pfp1.png"

# --- GENERAL SETTINGS ---
PAGE_TITLE = "Product Data Science | Agam Arora"
PAGE_ICON = ":wave:"
NAME = "Agam Arora"
DESCRIPTION = """
A full stack product data scientist. I train numbers to become great products. You should enroll your data in my school.
"""
EMAIL = "agam.arora11@gmail.com"
LINKEDIN = "https://www.linkedin.com/in/agamarora/"

st.set_page_config(page_title=PAGE_TITLE, page_icon=PAGE_ICON)

# --- LOAD CSS, PDF & PROFILE PIC ---
with open(css_file) as f:
    st.markdown("<style>{}</style>".format(f.read()), unsafe_allow_html=True)
with open(resume_file, "rb") as pdf_file:
    PDFbyte = pdf_file.read()
profile_pic = Image.open(profile_pic)

# --- HERO SECTION ---
st.markdown("<div style='text-align:center;'>", unsafe_allow_html=True)
st.image(profile_pic, width=230)
st.title(NAME)
st.write(DESCRIPTION)

button_col1, button_col2, button_col3 = st.columns(3)

button_style = """
    display: inline-block;
    width: 100%;
    padding: 8px 0;
    text-align: center;
    background-color: #0e0e0e;
    border: 1px solid #000;
    border-radius: 5px;
    text-decoration: none;
"""

with button_col1:
    st.markdown(
        """
    <a id="download-button" href="data:application/octet-stream;base64,{b64}" download="{filename}" style="{style}">
        📄 Download Resume
    </a>
    """.format(
            b64=base64.b64encode(PDFbyte).decode("utf-8"),
            filename=resume_file.name,
            style=button_style
        ),
        unsafe_allow_html=True,
    )

with button_col2:
    st.markdown(f"<a href='{LINKEDIN}' style='{button_style}'>🌐 LinkedIn</a>", unsafe_allow_html=True)

with button_col3:
    st.markdown(f"<a href='mailto:{EMAIL}' style='{button_style}'>📫 Email</a>", unsafe_allow_html=True)

st.markdown("</div>", unsafe_allow_html=True)


        


    


# --- SOCIAL LINKS ---



# --- EXPERIENCE & QUALIFICATIONS ---
st.write('\n')
st.subheader("About me")
st.write(
    """
- ✔️ I specialize in end-to-end data products with over 12 years of experience
- ✔️ I believe in clean and simple data experiences with actionable and targetable insights
- ✔️ I am a data-first, ENTJ personality with high execution capability
- ✔️ I have worked with complex UX problems in data management
- ✔️ I have led teams to create big data transformation and ETL pipelines
- ✔️ I have designed and deployed BI dashboards for scale
- ✔️ I work well with remote teams from different cultures
"""
)


# --- SKILLS ---
st.write('\n')
st.subheader("Hard Skills")
st.write(
    """
- 👩‍💻 Programming: Python (Scikit-learn, Pandas), SQL, Excel, NLP Prompts
- 📊 Data Visulization: PowerBi, MS Excel, Matplotlib, Dtale, Seaborn
- 📚 Designing: Figma, Photoshop, Wireframing, Prototyping
- 🗄️ Databases: Postgres, MongoDB, MySQL, ElasticSearch
"""
)



def project_card(title, description, plot_func=None):
    st.markdown(f"### {title}")
    st.markdown(description)

    if plot_func:
        plot_func()

    st.markdown("---")





projects = [
    ("🏆 Successfully crunched over 1 million excel sheets", "Not kidding, I would have done more had I been counting. But I started my career doing this and it soon became therapeutic. Now I have been coding Python scripts for meditation.", None),
    ("🏆 Weighting Model for Primary Research data problems (co-authored at first job)", "The project aims to generalize and weight the primary research data to ensure that the sample represents the global census. This project goes deep into the problems of primary data collection and how we can deal with them to ensure an unskewed and actionable result can be achieved.", None),
    ("🏆 Geocoding model using repeat addresses for last-mile delivery companies", "In one of my companies, we wanted to solve for the last mile. The biggest cost saver identified so far in the industry is fuel and time savings through correct addresses and accurate locational data. The goal of this project is to learn from previous deliveries and make the next one even more accurate. I led the complete end-to-end solution and deployment of the project.", None),
    ("🏆 Smart Hub locator and load balancing algorithm for dynamic driver assignment using geospatial data", "This is a research project that a couple of my colleagues started for one of our clients. Although it was parked at research, it managed to win us that client.", None),
    ("🏆 Predicting future route codes or delivery clusters based on historical delivery data", "This is one of the cooler things that we worked on. It is not a finished product yet but something of research that we might soon continue.", None),
]

st.subheader("Projects & Accomplishments")
for title, description, plot_func in projects:
    with st.expander(title, expanded=False):
        project_card(title, description, plot_func)




