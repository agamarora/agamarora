#building a digital resume using streamlit and then hosting that using renderers



#import dependencies
import streamlit as st
import pandas as pd
import numpy as np

#title
st.title("Digital Resume")

#header
st.header("About Me")

#about me
st.write("I am a Data Scientist with a background in Finance and Economics. I am passionate about data and how it can be used to solve real world problems. I am currently working as a Data Scientist at a FinTech company in the Bay Area. I am also a graduate student at the University of California, Berkeley, where I am pursuing a Master's in Information and Data Science. I am also a graduate of the University of California, Los Angeles, where I received my Bachelor's in Economics and a minor in Mathematics.")

#header
st.header("Education")

#education
st.write("University of California, Berkeley, Master of Information and Data Science, 2020 - Present")
st.write("University of California, Los Angeles, Bachelor of Arts in Economics, 2016 - 2020")
st.write("University of California, Los Angeles, Minor in Mathematics, 2016 - 2020")

#header
st.header("Work Experience")

#work experience
st.write("Data Scientist, FinTech Company, 2020 - Present")
st.write("Data Analyst, FinTech Company, 2019 - 2020")
st.write("Data Analyst, FinTech Company, 2018 - 2019")

#header
st.header("Skills")

#skills
st.write("Python")
st.write("SQL")
st.write("Tableau")
st.write("Excel")
st.write("R")

#header
st.header("Projects")

#projects
st.write("Project 1")
st.write("Project 2")
st.write("Project 3")


#header
st.header("Contact Me")

#contact me
st.write("Email: agam.arora11@gmail.com")
st.write("LinkedIn: https://www.linkedin.com/in/agamarora/")
st.write("Website: https://agamarora.com")
         
#footer
st.write("© 2020 Digital Resume. All rights reserved.")
st.write("Made with Streamlit")


