import unittest
from unittest.mock import patch
from app import app, static_path, template_path
import os

class AppTestCase(unittest.TestCase):
    def set_up(self):
        self.app = app.test_client()
        self.app.testing = True

    @patch.dict(os.environ, {'NYT_API_KEY': 'test-api-key'})
    def test_get_key(self):
        response = self.app.get('/api/key')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {'apiKey': 'test-api-key'})

    @patch('os.path.exists')
    @patch('app.send_from_directory')
    def test_serve_existing_static_file(self, mock_send_from_directory, mock_exists):
        mock_exists.return_value = True
        mock_send_from_directory.return_value = 'mocked response'
        
        response = self.app.get('/example.html')
        mock_send_from_directory.assert_called_with(static_path, 'example.html')
        self.assertEqual(response.data, b'mocked response')

    @patch('os.path.exists')
    @patch('app.send_from_directory')
    def test_serve_index_html_when_path_not_found(self, mock_send_from_directory, mock_exists):
        mock_exists.return_value = False
        mock_send_from_directory.return_value = 'mocked index'
        
        response = self.app.get('/nonexample.html')
        mock_send_from_directory.assert_called_with(template_path, 'index.html')
        self.assertEqual(response.data, b'mocked index')

    @patch('app.send_from_directory')
    def test_serve_root_path(self, mock_send_from_directory):
        mock_send_from_directory.return_value = 'mocked root'
        
        response = self.app.get('/')
        mock_send_from_directory.assert_called_with(template_path, 'index.html')
        self.assertEqual(response.data, b'mocked root')

if __name__ == '__main__':
    unittest.main()
