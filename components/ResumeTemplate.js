import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
});

const ResumeTemplate = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>{data.name || 'Your Name'}</Text>
        <Text style={styles.text}>{data.email} | {data.phone} | {data.jobTitle}</Text>
      </View>

      {data.summary && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>Summary</Text>
          <Text style={styles.text}>{data.summary}</Text>
        </View>
      )}

      {data.experience && data.experience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>Experience</Text>
          {data.experience.map((exp, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Text style={styles.text}>{exp.role} at {exp.company}</Text>
              <Text style={styles.text}>{exp.duration}</Text>
              <Text style={styles.text}>{exp.details}</Text>
            </View>
          ))}
        </View>
      )}

      {data.education && data.education.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>Education</Text>
          {data.education.map((edu, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Text style={styles.text}>{edu.qualification}</Text>
              <Text style={styles.text}>{edu.year} - {edu.location}</Text>
              <Text style={styles.text}>{edu.details}</Text>
            </View>
          ))}
        </View>
      )}
    </Page>
  </Document>
);

export default ResumeTemplate;