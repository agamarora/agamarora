from pathlib import Path

import streamlit as st
from PIL import Image


# --- PATH SETTINGS ---
current_dir = Path(__file__).parent if "__file__" in locals() else Path.cwd()
css_file = current_dir / "styles" / "main.css"
resume_file = current_dir / "assets" / "CV.pdf"
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
st.subheader("Experience & Qulifications")
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


# --- WORK HISTORY ---
st.write('\n')
st.subheader("Work History")
st.write("---")

# --- JOB 1
st.write("🚧", "**Lead Product Manager | FarEye Technologies Pvt. Ltd.**")
st.write("06/2021 - Present")
st.write(
    """
Role: As the Lead Product Manager of Data, I was responsible for the strategy and execution of data products aimed at enhancing the bottom line savings and top-line revenues of our customers. My role had a significant focus on improving last-mile operations through geo-locational and routing data products.

Achievements:
- Established the requirements for the foundational data platform and storage architecture, resulting in the creation of a robust data platform that hosts all our BI data, ML models, and transactional data.
- Envisioned and designed the complete overhaul of the company's legacy reporting module, leading to a reduction of over 500 support tickets per month and receiving high recommendations and positive feedback from clients.
- Actively engaged in numerous experimental and pilot projects co-authored with clients, focusing on geocoding, advanced sorting, and dynamic zoning, which contributed to the continuous innovation and improvement of our data product offerings.

Skills: Technical Leadership · Cross-functional Team Leadership · Data Analysis · Strategy · Team Leadership
"""
)

# --- JOB 2
st.write('\n')
st.write("🚧", "**Platform Product Manager | FarEye Technologies Pvt Ltd**")
st.write("12/2020 - 06/2021")
st.write(
    """
Role: As a Platform Product Manager, I oversaw the management of technical requirements and ad-hoc developments throughout the company. I effectively handled customer requests, strategically categorizing them to ensure the product vision remained intact and delivered cohesive value to our customers.

Achievements:
- Streamlined and spearheaded the ad-hoc process of triaging requests, leading to more efficient prioritization and management of customer needs.
- Fostered a bug-free culture of development, resulting in a more stable and reliable product offering.
- Established tracking and metrics to measure development speed, story points, and bug counts, providing greater visibility into team performance and areas for improvement.
- Implemented best practices for documenting and sharing information regarding bugs, enhancements, and platform requests, enhancing collaboration and knowledge sharing across the organization.

Skills: Technical Leadership · Cross-functional Team Leadership · Data Analysis · Product Management · Team Leadership
"""
)

# --- JOB 3
st.write('\n')
st.write("🚧", "**Technical Product & Program Consultant | Freelancer**")
st.write("12/2019 - 12/2020")
st.write(
    """
Role: As a Technical Product & Program Consultant, I provided subject matter expertise to clients in the technology industry across various domains, including data analytics, market research, technology roadmaps, planning and strategy, tech research, solution design, and product design, review, and consulting.

Achievements:
- Raised over $500,000 in funding for a startup through a successful grant application.
- Developed a data analytics platform for a startup, resulting in a 30% increase in sales and a 20% reduction in operational costs.
- Assited clients in SRED grant applications, resulting in over $1.5 million in funding.

Skills: Client Services · Technical Leadership · Data Analysis · Product Management · Business Strategy
"""
)



# --- JOB 4
st.write('\n')
st.write("🚧", "**Manager - Business Development and Expansion | Blossom Kochhar Group of Companies**")
st.write("06/2018 - 12/2019")
st.write(
    """
Role: As a Manager for Business Development and Expansion, I led a team focused on driving business growth through various initiatives.

Achievements: 
- Digitizing payments across all company and franchise-owned stores, streamlining transactions and enhancing customer experience.
- Building data management and analytics capabilities within the organization to support data-driven decision-making.
- Creating and training a 100+ sales team on digitization and standard operation procedures, fostering a culture of efficiency and consistency.
- Increasing bottom-line revenues by reducing the cost of operations by more than 30% through process optimization and cost-saving initiatives.
- Developing digital marketing strategies for both company and franchise businesses, resulting in increased brand visibility and customer engagement.

Skills: Stakeholder Management · Data Analysis · Business Strategy · Business Analysis · Marketing Strategy
"""
)


# --- JOB 5
st.write('\n')
st.write("🚧", "**Studio Head & Director | V2 Games India Pvt. Ltd.**")
st.write("12/2015 - 05/2018")
st.write(
    """
Role: As the Studio Head, I was responsible for setting up a mobile games and technology company in India for a Canadian technology firm.

Achievements:
- Building and managing a technology support team of 18 members, providing development, testing, analytics, and product management services.
- Contributing to the 2017 Indie Game of the Year on Google Play Store in Canada, showcasing our team's commitment to quality and innovation.
- Establishing data recording, handling, and analytics capabilities for the organization to facilitate data-driven decision-making and insights.
- Creating data visualization processes and dashboards for the organization, improving accessibility and understanding of key metrics and trends.

Skills: Data Analysis · Product Management · Marketing · Management · Leadership
"""
)

# --- JOB 6
st.write('\n')
st.write("🚧", "**Data Analyst | Absolutdata Analytics**")
st.write("04/2014 - 12/2015")
st.write(
    """
Role: As a Data Analyst, I was responsible for data analytics and market research for clients based in North America and Europe.

Achievements:
- Working on a proprietary data weighting product for a global survey conducted in over 23 countries with more than 200,000 respondents, ensuring accurate representation and insights.
- Conducting segmentation and needs-based analysis to identify target customer groups and their preferences.
- Creating user profiles using demographics and psychographics to better understand and cater to customer needs.
- Performing data collection, cleaning, and pre-processing tasks to ensure data quality and consistency in analysis and reporting.

Skills: Data Analysis · Business Strategy · Statistical Data Analysis · Marketing Strategy · Business Decision Making
"""
)


# --- JOB 6
st.write('\n')
st.write("🚧", "**Data Analyst | Absolutdata Analytics**")
st.write("04/2014 - 12/2015")
st.write(
    """
Role: As an intern at Michael Page International, a specialist recruitment firm, I worked closely with the recruitment team responsible for Sales & Marketing hiring in the Healthcare & Life Sciences and FMCG/Consumer Durable verticals.

Achievements:
- Assisting in recruiting for mid to senior-level executive positions, such as Brand Manager, Area Manager, Country Head, and Sales Manager, across various verticals.
- Conducting research for the Salary & Employment Forecast 2013/14, which combined quantitative and qualitative research derived from a national survey of employers and extensive involvement in the professional labor market. This involved surveying 420 employers and 1,600 middle and senior-level job seekers within our specialist disciplines.

Skills: Market Research · Data Analysis · Marketing · Forecasting · Microsoft Excel
"""
)

# --- Projects & Accomplishments ---
st.write('\n')
st.subheader("Projects & Accomplishments")
st.write("---")
for project, link in PROJECTS.items():
    st.write(f"[{project}]({link})")
