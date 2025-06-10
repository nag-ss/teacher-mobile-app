import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function UploadMaterialsCard({ title }: { title: string }) {
    return (
        <View style={styles.card}>
            <View style={styles.content}>
                <Image
                    source={require('../../assets/images/upload-icon.png')} // update path based on your project
                    style={styles.image}
                    resizeMode="contain"
                />
                <Text style={styles.title}>{title}</Text>
                <View style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 1,
                    marginBottom: 10
                }}></View>
                <Text style={styles.subtitle}>Please add your content here.</Text>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Upload</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 200,
        height: 200,
        paddingLeft: 10,
        paddingTop: 10,
        borderWidth: 0.5,
        borderRadius: 10,
        borderColor: 'grey'
    },
    content: {
        width: '100%',
        paddingHorizontal: 10,
    },
    image: {
        width: 36,
        height: 36,
        marginBottom: 10,
    },
    title: {
        fontSize: 16,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 11,
        color: '#64748b', // slate-500 equivalent
        marginBottom: 8,
    },
    button: {
        width: 160,
        height: 56,
        borderColor: '#4ade80', // green-400
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#64748b',
    },
});
