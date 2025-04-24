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
        // backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: '100%',
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    image: {
        width: 48,
        height: 48,
        marginBottom: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 12,
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
