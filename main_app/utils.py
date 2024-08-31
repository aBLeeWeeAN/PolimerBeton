# from django.contrib.admin.models import LogEntry, ADDITION, CHANGE, DELETION
# from django.contrib.contenttypes.models import ContentType
# from django.utils.timezone import now

# def log_action(user, content_object, action_flag, change_message=''):
#     """
#     Логирует действие в журнал админки.
    
#     :param user: Пользователь, который выполнил действие
#     :param content_object: Объект, над которым было выполнено действие
#     :param action_flag: Флаг действия (ADDITION, CHANGE, DELETION)
#     :param change_message: Сообщение о изменении
#     """
#     content_type = ContentType.objects.get_for_model(content_object)
#     LogEntry.objects.create(
#         user=user,
#         content_type=content_type,
#         object_id=content_object.pk,
#         object_repr=str(content_object),
#         action_flag=action_flag,
#         change_message=change_message,
#         action_time=now()
#     )