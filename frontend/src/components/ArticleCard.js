import React from 'react';
import { Card, CardContent, Typography, Box, Divider, Chip } from '@mui/material';
import { green, yellow, red } from '@mui/material/colors';
import WhatshotIcon from '@mui/icons-material/Whatshot';

// Function to get color based on risk level
const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
        case 0:
            return 'error';
        case 50:
            return 'warning';
        case 100:
            return 'success';
        default:
            return true;
    }
};

const getRiskName = (riskLevel) => {
    switch (riskLevel) {
        case 0:
            return 'High Risk';
        case 50:
            return 'Medium Risk';
        case 100:
            return 'Low Risk';
        default:
            return true;
    }
};

const getRiskHeight = (riskLevel) => {
    switch (riskLevel.toLowerCase()) {
        case 'low':
            return '30%';
        case 'medium':
            return '60%';
        case 'high':
            return '90%';
        default:
            return '10%';
    }
};


// Main component to render an article
const ArticleCard = ({ article }) => {
    return (
        <Card variant="outlined" sx={{ marginBottom: 3, boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                    Article
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 2 }}>
                    {article.content}
                </Typography>

                <Divider sx={{ marginY: 2 }} />

                <Typography variant="h6" color="primary" gutterBottom>
                    Explanation
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
                    {article.explanation}
                </Typography>

                <Divider sx={{ marginY: 2 }} />

                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center">
                        <Typography variant="h6" color="primary" sx={{ marginRight: 2 }}>
                            Risk Assessment:
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
                            {article.explanation}
                        </Typography>
                        {/* <Chip
                            label={article.riskAssessment}
                            sx={{ backgroundColor: getRiskColor(article.riskAssessment), color: '#fff' }}
                        /> */}
                    </Box>

                    {/* Vertical bar representing risk level */}
                    <Box
                        sx={{
                            width: 10,
                            height: getRiskHeight(article.riskAssessment),
                            backgroundColor: getRiskColor(article.riskAssessment),
                            borderRadius: 1,
                            transition: 'height 0.3s ease-in-out',
                        }}

                    />
                    <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignContent={'center'}>
                        <Box p={2} display={'flex'} justifyContent={'center'}>
                            <WhatshotIcon  fontSize='large' color={getRiskColor(article.riskLevel)}></WhatshotIcon>
                        </Box>
                        <Chip label={getRiskName(article.riskLevel)} variant='outlined' color={getRiskColor(article.riskLevel)}></Chip>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ArticleCard;
