import api from './client';

export async function downloadPdf(projectId: string, filename?: string) {
  try {
    const response = await api.get(`/reports/project/${projectId}/pdf`, {
      responseType: 'blob',  // ← Important pour fichiers binaires
    });
    
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `rapport-${projectId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erreur téléchargement PDF:', error);
    alert('Erreur lors du téléchargement du PDF');
  }
}

export async function downloadExcel(projectId: string, filename?: string) {
  try {
    const response = await api.get(`/reports/project/${projectId}/excel`, {
      responseType: 'blob',
    });
    
    const blob = new Blob([response.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `donnees-${projectId}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erreur téléchargement Excel:', error);
    alert('Erreur lors du téléchargement Excel');
  }
}