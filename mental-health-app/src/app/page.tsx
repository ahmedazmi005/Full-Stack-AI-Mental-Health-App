
'use client'
import { useState } from 'react';
import React from "react";
import './App.css'
import DisplayCard from './components/displaycard';
import Navigation from './components/Navigation';

const App = () => {
  return (
    <>
      <Navigation />
      <div className="App">
        <h1>Mental Health Awareness</h1>  
        <strong>This website was created with the goal to destigmatize mental illness and spread awareness by providing an easy to access directory of several mental health disorders that people go through and resources to learn more. Mental health includes our emotional, psychological, and social well-being. It affects how we think, feel, and act. It also helps determine how we handle stress, relate to others, and make choices. Mental health is important at every stage of life, from childhood and adolescence through adulthood - and being aware of what other people go through can help us all understand and support each other.
        </strong>
        <p>Note: Please understand that this list is not exhaustive and although these descriptions were written to be as accurate as possible, mental illnesses are nuanced. It is encouraged to use the links provided to learn more.</p>
        <div className="cards-container">
          <DisplayCard image='/images/depression.jpg' alt='photographic representation of depression' name="Depression" desc="Depression is a common mental health condition characterized by persistent low mood, low energy and a loss of interest in daily activities. Depression can significantly interfere with a persons ability to engage in daily life." link='https://www.who.int/news-room/fact-sheets/detail/depression'/>
          <DisplayCard image='/images/anxiety.jpg' alt='photographic representation of anxiety' name="Anxiety" desc="Anxiety is a condition in which the individual experiences persistent and intense episodes of fear and nervousness, which can be triggered by specific situations." link='https://my.clevelandclinic.org/health/diseases/9536-anxiety-disorders'/>
          <DisplayCard image='/images/bipolar-disorder.png' alt='photographic representation of bipolar disorder' name="Bipolar Disorder" desc="Bipolar disorder is a mental health condition characterized by extreme mood swings that include emotional highs (mania or hypomania) and lows (depression)." link='https://my.clevelandclinic.org/health/diseases/9294-bipolar-disorder'/>
          <DisplayCard image='/images/schizophrenia.webp' alt='photographic representation of schizophrenia' name='Schizophrenia' desc='Schizophrenia is a chronic mental illness characterized by disruptions in a persons thought processes, perceptions, emotions and social interactions' link='https://www.mayoclinic.org/diseases-conditions/schizophrenia/symptoms-causes/syc-20354443'/>
          <DisplayCard image='/images/schizoaffective.png' alt='photographic representation of schizoaffective disorder' name='Schizoaffective Disorder' desc='Schizoaffective disorder is a mental health condition that includes symptoms of both schizophrenia and a mood disorder such as bipolar disorder or depression.' link='https://www.mayoclinic.org/diseases-conditions/schizoaffective-disorder/symptoms-causes/syc-20354504'/>
          <DisplayCard image='/images/ocd.jpg' alt='photographic representation of OCD' name='Obsessive-Compulsive Disorder' desc='Obsessive-compulsive disorder (OCD) is a mental health condition characterized by persistent, unwanted thoughts (obsessions) and repetitive behaviors (compulsions).' link='https://iocdf.org/about-ocd/'/>
          <DisplayCard image='/images/adhd.jpg' alt='photographic representation of ADHD' name='Attention-Deficit/Hyperactivity Disorder' desc='Attention-deficit/hyperactivity disorder (ADHD) is a neurodevelopmental disorder that affects a persons ability to pay attention, control impulsive behaviors and manage energy levels.' link='https://www.mayoclinichealthsystem.org/hometown-health/speaking-of-health/what-is-adhd'/>
          <DisplayCard image='/images/autism.jpg' alt='photographic representation of autism' name='Autism Spectrum Disorder' desc='Autism spectrum disorder (ASD) is a developmental disorder that affects communication and behavior. Although autism can be diagnosed at any age, it is said to be a "developmental disorder" because symptoms generally appear in the first two years of life.' link='https://www.mayoclinic.org/diseases-conditions/autism-spectrum-disorder/symptoms-causes/syc-20352928'/>
          <DisplayCard image='/images/bpd.jpg' alt='photographic representation of borderline personality disorder' name='Borderline Personality Disorder' desc='Borderline personality disorder (BPD) is a mental health condition characterized by intense, unstable emotions, impulsive behaviors, and difficulty maintaining relationships.' link='https://www.mayoclinic.org/diseases-conditions/borderline-personality-disorder/symptoms-causes/syc-20370237'/>
          <DisplayCard image='/images/eating-disorder.jpg' alt='photographic representation of eating disorder' name='Eating Disorders' desc='Eating disorders are a range of psychological conditions that cause unhealthy eating habits to develop. They might start with an obsession with food, body weight, or body shape.' link='https://www.mayoclinic.org/diseases-conditions/eating-disorders/symptoms-causes/syc-20353603'/>
          <DisplayCard image='/images/ptsd.jpg' alt='photographic representation of PTSD' name='Post-Traumatic Stress Disorder' desc='Post-traumatic stress disorder (PTSD) is a mental health condition that is triggered by a terrifying event — either experiencing it or witnessing it.' link='https://www.mayoclinic.org/diseases-conditions/post-traumatic-stress-disorder/symptoms-causes/syc-20355967'/>
        </div>
      </div>
    </>
  )
}

export default App
