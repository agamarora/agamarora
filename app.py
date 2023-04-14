from pathlib import Path

import streamlit as st
from PIL import Image


# --- PATH SETTINGS ---
current_dir = Path(__file__).parent if "__file__" in locals() else Path.cwd()
css_file = current_dir / "styles" / "main.css"
resume_file = current_dir / "assets" / "Resume_AgamArora.pdf"
profile_pic = current_dir / "assets" / "pfp1.png"


# --- GENERAL SETTINGS ---
PAGE_TITLE = "Digital CV | Agam Arora"
PAGE_ICON = ":wave:"
NAME = "Agam Arora"
DESCRIPTION = """
Principal Product Manager with advanced data analytics skills.
"""
EMAIL = "agam.arora11@gmail.com"
SOCIAL_MEDIA = {
    "LinkedIn": "https://www.linkedin.com/in/agamarora/"

}
PROJECTS = {
    "🏆 Weighting Model for Primary Research data problems": "",
    "🏆 Geocoding model using repeat addresses for a last mile delivery companies ": "",
    "🏆 Smart Hub locator and load balancing algorithm for dynamic driver assignment using geospatial data": "",
    "🏆 Predicting future route codes or delivery clusters based on historical delivery data": "",
}


st.set_page_config(page_title=PAGE_TITLE, page_icon=PAGE_ICON)


# --- LOAD CSS, PDF & PROFIL PIC ---
with open(css_file) as f:
    st.markdown("<style>{}</style>".format(f.read()), unsafe_allow_html=True)
with open(resume_file, "rb") as pdf_file:
    PDFbyte = pdf_file.read()
profile_pic = Image.open(profile_pic)


# --- HERO SECTION ---
col1, col2 = st.columns(2, gap="small")
with col1:
    st.image(profile_pic, width=230)

with col2:
    st.title(NAME)
    st.write(DESCRIPTION)
    st.download_button(
        label=" 📄 Download Resume",
        data=PDFbyte,
        file_name=resume_file.name,
        mime="application/octet-stream",
    )
    st.write("📫", EMAIL)


# --- SOCIAL LINKS ---
st.write('\n')
cols = st.columns(len(SOCIAL_MEDIA))
for index, (platform, link) in enumerate(SOCIAL_MEDIA.items()):
    cols[index].write(f"[{platform}]({link})")


# --- EXPERIENCE & QUALIFICATIONS ---
st.write('\n')
st.subheader("Experience & Qualifications")
st.write(
    """
- ✔️ Over a decade of experience leveraging data-driven insights to drive business growth and efficiency
- ✔️ Proficient in Python and Excel, with a proven track record in applying these skills across various industries
- ✔️ Solid grasp of statistical concepts and their practical application in real-world scenarios
- ✔️ Highly collaborative team member, demonstrating exceptional initiative and proactive problem-solving abilities
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


# --- Projects & Accomplishments ---
st.write('\n')
st.subheader("Projects & Accomplishments")
st.write("---")
for project, link in PROJECTS.items():
    st.write(f"[{project}]({link})")
